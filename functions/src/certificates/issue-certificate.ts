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

    const eventInfoCache: EventCacheObject = {};

    majorEvent.data()?.events.forEach((eventID: string) => {
      firestore
        .doc(`events/${eventID}`)
        .get()
        .then((event) => {
          if (event.exists) {
            const data = event.data();
            if (data) {
              const eventInfo = {
                eventName: data.name,
                workload: data.workload,
                eventStartDate: data.eventStartDate,
                eventType: data.eventType,
                eventGroup: data.eventGroup,
              };
              eventInfoCache[eventID] = eventInfo;
            }
          }
        });
    });

    let failed = [];
    if (data.certificateData.issuedTo.toPayer) {
      const subscriptionList = await firestore
        .collection(`majorEvents/${majorEventID}/subscriptions`)
        .where('payment.status', '==', 2)
        .get();

      for (const attendance of subscriptionList.docs) {
        const uid = attendance.id;
        const result = await issueCertificate(data.certificateData, uid, majorEventID, eventInfoCache);
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

const issueCertificate = async (
  certificateData: CertificateData,
  userUID: string,
  eventID: string,
  eventInfoCache: EventCacheObject
) => {
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
      content: await generateContent(eventsUserParticipated, eventInfoCache),
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
    await firestore.doc(`users/${userUID}/certificates/majorEvents/${eventID}/${documentID}`).set({
      publicReference: firestore.doc(`certificates/${eventID}/${documentID}/public`),
      certificateName: certificateData.certificateName,
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

const generateContent = async (eventsUserParticipated: string[], eventInfoCache: EventCacheObject) => {
  const palestras: EventCache[] = [];
  const minicursos: EventCache[] = [];
  const uncategorized: EventCache[] = [];

  // TODO: Considerar grupos de eventos
  for (const eventID of eventsUserParticipated) {
    switch (eventInfoCache[eventID].eventType) {
      case 'palestra':
        palestras.push(eventInfoCache[eventID]);
        break;
      case 'minicurso':
        minicursos.push(eventInfoCache[eventID]);
        break;
      default:
        uncategorized.push(eventInfoCache[eventID]);
        break;
    }
  }

  // Sort events by date
  palestras.sort((a, b) => a.eventStartDate.toMillis() - b.eventStartDate.toMillis());
  minicursos.sort((a, b) => a.eventStartDate.toMillis() - b.eventStartDate.toMillis());
  uncategorized.sort((a, b) => a.eventStartDate.toMillis() - b.eventStartDate.toMillis());

  // Generate content string
  let content = '';

  makeText('Palestra', palestras);
  makeText('Minicurso', minicursos);
  makeText('Atividade', uncategorized);

  console.log(content);

  return content;
};

function makeText(type: string, array: any[]): string {
  let content = '';

  if (array.length > 0) {
    content += type;
    if (array.length > 1) {
      // If last character is 'm' replace it with 'ns'
      if (content.slice(-1) === 'm') {
        content = content.slice(0, -1) + 'ns';
      } else if (content.slice(-2) === 'ão') {
        content = content.slice(0, -2) + 'ões';
      } else {
        content += 's';
      }
    }
    content += '\n:';

    let totalWorkload = 0;
    for (const event of array) {
      content += `• ${formatTimestamp(event.eventStartDate)} - ${event.eventName} - Carga horária: ${
        event.workload + 'horas' || 'indefinida'
      };\n`;
    }
    content = content.slice(0, -2) + '.\n';
    content += `\nCarga horária total: ${totalWorkload} horas\n`;
    content += '\n\n';
  }

  return content;
}

function formatTimestamp(date: Timestamp): string {
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

interface EventCacheObject {
  [eventID: string]: EventCache;
}

interface EventCache {
  eventStartDate: Timestamp;
  eventName: string;
  workload: number;
  eventType: string;
  eventGroup?: {
    groupDisplayName: string;
    groupEventIDs: string[];
    mainEventID: string;
  } | null;
}
