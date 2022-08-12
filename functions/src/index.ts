import * as functions from 'firebase-functions';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

initializeApp({
  credential: applicationDefault(),
});

// Attribution: The Net Ninja
// https://youtube.com/watch?v=VvcBqPua2DI&list=PL4cUxeGkcC9jUPIes_B8vRjn1_GaplOPQ

exports.addAdminRole = functions.https.onCall((data, context) => {
  // Check if request is made by an admin
  if (!context.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
  }

  if (context.app == undefined) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called from an App Check verified app.'
    );
  }

  if (context.auth.token.role !== 1000) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called by an admin.');
  }

  // Get user and add custom claim (admin)
  return getAuth()
    .getUserByEmail(data.email)
    .then((user) => {
      return getAuth().setCustomUserClaims(user.uid, {
        role: 1000,
      });
    })
    .then(() => {
      return {
        message: `Success! ${data.email} has been made an admin`,
      };
    })
    .catch((error) => {
      return {
        message: `An error has occured: ${error}`,
      };
    });
});

exports.removeAdminRole = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
  }

  if (context.app == undefined) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called from an App Check verified app.'
    );
  }

  if (context.auth.token.role !== 1000) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called by an admin.');
  }

  const whitelist = ['renan.yudi@unesp.br', 'willian.murayama@unesp.br', 'gc.tomiasi@unesp.br'];

  if (whitelist.includes(data.email)) {
    throw new functions.https.HttpsError('failed-precondition', 'You cannot remove this user.');
  }

  return getAuth()
    .getUserByEmail(data.email)
    .then((user) => {
      return getAuth().setCustomUserClaims(user.uid, {
        role: undefined,
      });
    })
    .then(() => {
      return {
        message: `Success! ${data.email} has been demoted from admin`,
      };
    })
    .catch((error) => {
      return {
        message: `An error has occured: ${error}`,
      };
    });
});

exports.getUserUid = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
  }

  if (context.app == undefined) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called from an App Check verified app.'
    );
  }

  if (context.auth.token.role !== 1000) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called by an admin.');
  }

  if (data.string === '') {
    return { message: 'Invalid argument: A string must be provided.' };
  }

  if (data.string.includes('@')) {
    return getAuth()
      .getUserByEmail(data.string)
      .then((user) => {
        return {
          uid: user.uid,
        };
      })
      .catch((error) => {
        return { message: `${error}` };
      });
  }
  // Check if string only has numbers
  if (!data.string.match(/^\+?[0-9]+$/)) {
    return { message: 'Invalid argument: Invalid string' };
  }

  if (data.string.length === 11) {
    data.string = `+55${data.string}`;
  }

  return getAuth()
    .getUserByPhoneNumber(data.string)
    .then((user) => {
      return {
        uid: user.uid,
      };
    })
    .catch((error) => {
      return { message: `${error}` };
    });
});
