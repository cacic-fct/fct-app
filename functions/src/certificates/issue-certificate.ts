import { format as formatDate } from 'date-fns';
import { Timestamp } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue } from 'firebase-admin/firestore';
import { MainReturnType } from './../shared/return-types';

exports.issueMajorEventCertificate = functions.https.onCall(
  async (data: MajorEventCertificateData, context): Promise<MainReturnType> => {
    if (context.app == undefined) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'The function must be called from an App Check verified app.'
      );
    }

    // Check if request is made by an admin
    if (!context.auth) {
      throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
    }

    if (context.auth.token.role !== 1000) {
      throw new functions.https.HttpsError('failed-precondition', 'The function must be called by an admin.');
    }

    const firestore = admin.firestore();

    const majorEventID: string = data.majorEventID;

    // Return error if major event doesn't exist
    const majorEvent = await firestore.doc(`majorEvents/${majorEventID}`).get();
    if (!majorEvent.exists) {
      throw new functions.https.HttpsError('not-found', 'Major event not found.');
    }

    // Check if certificate already exists
    const certificate = await firestore
      .doc(`majorEvents/${majorEventID}/certificates/${data.certificateData.certificateID}`)
      .get();

    if (certificate.exists) {
      // Check to whom the certificate was issued
      const issuedTo = certificate.data()?.issuedTo as {
        toPayer: boolean;
        toNonSubscriber: boolean;
        toNonPayer: boolean;
        toList: string[];
      };

      // If the certificate was issued to the same people, return error
      if (
        issuedTo.toPayer === data.certificateData.issuedTo.toPayer &&
        issuedTo.toNonSubscriber === data.certificateData.issuedTo.toNonSubscriber &&
        issuedTo.toNonPayer === data.certificateData.issuedTo.toNonPayer
      ) {
        throw new functions.https.HttpsError('already-exists', 'Certificate already exists.');
      }

      // If certificate is issuing to person already on list, return error
      if (issuedTo.toList.length > 0) {
        for (const uid of issuedTo.toList) {
          if (data.certificateData.issuedTo.toList.includes(uid)) {
            throw new functions.https.HttpsError('already-exists', 'Certificate already exists.');
          }
        }
      }

      // If certificate is issuing to new people, add them to the list
      await certificate.ref.update({
        issuedTo: {
          toPayer: data.certificateData.issuedTo.toPayer,
          toNonSubscriber: data.certificateData.issuedTo.toNonSubscriber,
          toNonPayer: data.certificateData.issuedTo.toNonPayer,
          toList: FieldValue.arrayUnion(...data.certificateData.issuedTo.toList),
        },
      });
    }

    // If certificate doesn't exist, create it
    else {
      await certificate.ref.set({
        issuedTo: {
          toPayer: data.certificateData.issuedTo.toPayer,
          toNonSubscriber: data.certificateData.issuedTo.toNonSubscriber,
          toNonPayer: data.certificateData.issuedTo.toNonPayer,
          toList: data.certificateData.issuedTo.toList,
        },
        certificateData: {
          certificateID: data.certificateData.certificateID,
          certificateName: data.certificateData.certificateName,
          certificateTemplate: data.certificateData.certificateTemplate,
        },
        issuedOn: FieldValue.serverTimestamp(),
      });
    }

    let failed = [];
    if (data.certificateData.issuedTo.toPayer) {
      const subscriptionList = await firestore
        .collection(`majorEvents/${majorEventID}/subscriptions`)
        .where('payment.status', '==', 2)
        .get();

      for (const attendance of subscriptionList.docs) {
        const uid = attendance.id;
        const result = await issueCertificate(data.certificateData, uid, majorEventID);
        if (!result.success) {
          console.log('Error:', result);
          failed.push({ uid: uid, error: result.message });
        }
      }
    }

    if (failed.length > 0) {
      console.log('Error:', failed);

      return {
        success: false,
        message: 'Some certificates were not issued.',
        //data: failed,
      };
    }

    return {
      success: true,
      message: 'Certificate issued successfully.',
    };
  }
);

const issueCertificate = async (certificateData: CertificateData, userUID: string, eventID: string) => {
  const firestore = admin.firestore();
  const auth = getAuth();

  // Check if user exists
  auth.getUser(userUID).catch((error) => {
    throw new functions.https.HttpsError('not-found', 'User not found.');
  });

  // Check if user already has certificate with same ID
  const certificate = await firestore
    .doc(`users/${userUID}/certificates/majorEvents/${eventID}/${certificateData.certificateID}`)
    .get();

  if (certificate.exists) {
    throw new functions.https.HttpsError('already-exists', 'Certificate already exists.');
  }

  const userData = (await firestore.doc(`users/${userUID}`).get()).data();

  if (!userData) {
    throw new functions.https.HttpsError('not-found', 'User data not found.');
  }

  const documentID = firestore.collection('dummy').doc().id;

  let userDocumentFormat;

  if (userData.cpf.match(/\d{3}\.\d{3}\.\d{3}-\d{2}/)) {
    // Censor first 3 digits
    userDocumentFormat = userData.cpf.replace(/\d{3}\./, '•••.');
    // Censor last 2 digits
    userDocumentFormat = userDocumentFormat.replace(/-\d{2}/, '-••');
  }

  const eventsUserParticipated: string[] = await getEventsUserParticipated(eventID, userUID);

  try {
    // Create certificate
    await firestore.doc(`certificates/${eventID}/${documentID}/public`).set({
      fullName: userData.fullName,
      document: userDocumentFormat,
      issueDate: certificateData.issueDate,
      content: await generateContent(eventsUserParticipated),
      certificateName: certificateData.certificateName,
      attendedEvents: eventsUserParticipated,
    });

    await firestore.doc(`certificates/${eventID}/${documentID}/private`).set({
      document: userData.cpf,
      uid: userUID,
    });

    await firestore.doc(`certificates/${eventID}/${documentID}/admin`).set({
      actualIssueDate: FieldValue.serverTimestamp(),
      issuedBy: 'eu',
    });

    // Reference certificate in users/id/certificates
    await firestore.doc(`users/${userUID}/certificates/majorEvents/${eventID}/${certificateData.certificateID}`).set({
      public_reference: firestore.doc(`certificates/${eventID}/${documentID}/public`),
      certificateID: documentID,
    });
  } catch (error) {
    return {
      success: false,
      message: error,
    };
  }

  return {
    success: true,
    message: 'Certificate issued successfully.',
  };
};

const getEventsUserParticipated = async (majorEventID: string, userUID: string): Promise<string[]> => {
  const firestore = admin.firestore();
  const majorEventRef = firestore.doc(`majorEvents/${majorEventID}`);

  // Get userSubscription.subscribedToEvents
  const userSubscription = (await majorEventRef.collection('subscriptions').doc(userUID).get()).data();
  if (!userSubscription) {
    throw new functions.https.HttpsError('not-found', 'User not subscribed to major event.');
  }

  const subscribedToEvents = userSubscription.subscribedToEvents;

  // For every event user is subscribed to, check if user doc is in attendance
  const eventsUserParticipated = [];

  for (const eventID of subscribedToEvents) {
    functions.logger.log(`Checking event ${eventID}`);
    const attendance = await firestore.doc(`events/${eventID}/attendance/${userUID}`).get();
    if (attendance.exists) {
      functions.logger.log(`User is attending event ${eventID}`);
      eventsUserParticipated.push(eventID);
    }
  }

  return eventsUserParticipated;
};

const generateContent = async (eventsUserParticipated: string[]) => {
  // For every event userParticipated in, get event type and store it
  const firestore = admin.firestore();

  const palestras = [];
  const minicursos = [];
  const uncategorized = [];

  // TODO: Considerar grupos de eventos
  for (const eventID of eventsUserParticipated) {
    const event = (await firestore.doc(`events/${eventID}`).get()).data();
    if (event) {
      const eventData = {
        date: event.eventStartDate as Timestamp,
        name: event.name,
        workload: event.duration,
        type: event.eventType,
        group: event.eventGroup,
      };
      console.log('StartDate:', event.eventStartDate);
      switch (event.eventType) {
        case 'palestra':
          palestras.push(eventData);
        case 'minicurso':
          minicursos.push(eventData);
        default:
          uncategorized.push(eventData);
      }
    }
  }

  // Sort events by date
  palestras.sort((a, b) => a.date.toMillis() - b.date.toMillis());
  minicursos.sort((a, b) => a.date.toMillis() - b.date.toMillis());
  uncategorized.sort((a, b) => a.date.toMillis() - b.date.toMillis());

  // Generate content string
  let content = '';

  if (palestras.length > 0) {
    let totalWorkload = 0;
    content += 'Palestras:\n';
    for (const palestra of palestras) {
      content += `• ${formatTimestamp(palestra.date)} - ${palestra.name} - Carga horária: ${palestra.workload} horas\n`;
    }
    content += `\nCarga horária total: ${totalWorkload} horas\n`;
    content += '\n\n';
  }
  if (minicursos.length > 0) {
    let totalWorkload = 0;
    content += 'Minicursos:\n';
    for (const minicurso of minicursos) {
      content += `• ${formatTimestamp(minicurso.date)} - ${minicurso.name} - Carga horária: ${
        minicurso.workload
      } horas\n`;
      totalWorkload += minicurso.workload;
    }
    content += `\nCarga horária total: ${totalWorkload} horas\n`;
    content += '\n\n';
  }

  if (uncategorized.length > 0) {
    let totalWorkload = 0;
    content += 'Atividades:\n';
    for (const atividade of uncategorized) {
      content += `• ${formatTimestamp(atividade.date)} - ${atividade.name} - Carga horária: ${
        atividade.workload
      } horas\n`;
    }
    content += `\nCarga horária total: ${totalWorkload} horas\n`;
    content += '\n\n';
  }

  console.log(content);

  return content;
};

function formatTimestamp(date: Timestamp): string {
  // Format timestamp to dd/mm/yyyy - hh:mm
  const dateFormatted = date.toDate();
  return formatDate(dateFormatted, 'dd/MM/yyyy - HH:mm');
}

interface MajorEventCertificateData {
  majorEventID: string;
  issuer: string;

  certificateData: CertificateData;
}

interface CertificateData {
  certificateName: string;
  certificateID: string;
  certificateTemplate: string;
  issueDate: Timestamp;
  participation: {
    type: string;
    custom?: string;
  };
  event: {
    type: string;
    custom?: string;
  };
  content: {
    type: string;
    custom?: string;
  };
  issuedTo: {
    toPayer: boolean;
    toNonSubscriber: boolean;
    toNonPayer: boolean;
    toList: string[];
  };
}
