import * as functions from 'firebase-functions';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

initializeApp({
  credential: applicationDefault(),
});

exports.addAdminRole = functions.https.onCall((data, context) => {
  // check request is made by an admin
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called while authenticated.'
    );
  }

  if (context.app == undefined) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called from an App Check verified app.'
    );
  }

  // get user and add custom claim (admin)
  return getAuth()
    .getUserByEmail(data.email)
    .then((user) => {
      return getAuth().setCustomUserClaims(user.uid, {
        admin: true,
      });
    })
    .then(() => {
      return {
        message: `Success! ${data.email} has been made an admin`,
      };
    })
    .catch((error) => {
      return {
        message: `An error occured: ${error}`,
      };
    });
});

exports.removeAdminRole = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called while authenticated.'
    );
  }

  if (context.app == undefined) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called from an App Check verified app.'
    );
  }

  const whitelist = [
    'renan.yudi@unesp.br',
    'willian.murayama@unesp.br',
    'gc.tomiasi@unesp.br',
  ];

  if (whitelist.includes(data.email)) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'You cannot remove this user.'
    );
  }

  return getAuth()
    .getUserByEmail(data.email)
    .then((user) => {
      return getAuth().setCustomUserClaims(user.uid, {
        admin: undefined,
      });
    })
    .then(() => {
      return {
        message: `Success! ${data.email} has been demoted from admin`,
      };
    })
    .catch((error) => {
      return {
        message: `An error occured: ${error}`,
      };
    });
});
