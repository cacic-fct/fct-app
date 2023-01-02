import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

import { FieldValue } from 'firebase-admin/firestore';

initializeApp({
  credential: applicationDefault(),
});

import * as populate_db from './development-tools/populate-db/populate-db';
import * as claims from './claims/claims';
import * as firestore_triggers from './firestore-triggers/firestore-triggers';
exports.populate_db = populate_db;
exports.claims = claims;

// Attribution: The Net Ninja
// https://youtube.com/watch?v=VvcBqPua2DI&list=PL4cUxeGkcC9jUPIes_B8vRjn1_GaplOPQ

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

  if (context.auth.token.role >= 3000) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called by an authorized role.');
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
  // Remove spaces from the string
  data.string = data.string.replace(/\s/g, '');

  // Check if input has only one '+' and numbers
  const isNumeric: boolean = /^\+?\d+$/.test(data.string);

  // Check if string only has numbers
  if (!isNumeric) {
    return { message: 'Invalid argument: Invalid input' };
  }

  if (data.string.length < 11 || data.string.length > 14) {
    return { message: 'Invalid argument: Invalid input' };
  }

  if (data.string.length === 11) {
    data.string = `+55${data.string}`;
  } else if (data.string.length === 13) {
    data.string = `+${data.string}`;
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

exports.firestore_triggers = firestore_triggers;

// Attribution: amiregelz
// https://stackoverflow.com/questions/36759627/firebase-login-as-other-user/71808501#71808501
exports.impersonate = functions.https.onCall((data, context) => {
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
  const remoteConfig = admin.remoteConfig();

  // Get whitelist array as string from remote config
  return remoteConfig.getTemplate().then((template) => {
    // @ts-ignore
    const whitelist: string = template.parameters.adminWhitelist.defaultValue?.value;

    if (context.auth?.uid) {
      return admin
        .auth()
        .getUser(context.auth.uid)
        .then((userRecord) => {
          if (userRecord.email && whitelist.includes(userRecord.email)) {
            const userId = data.uid;
            return admin
              .auth()
              .createCustomToken(userId)
              .then((customToken) => {
                return {
                  token: customToken,
                };
              });
          } else {
            throw new functions.https.HttpsError('failed-precondition', 'You are not whitelisted.');
          }
        })
        .catch((error) => {
          return { message: `${error}` };
        });
    }

    throw new functions.https.HttpsError('failed-precondition', 'Your uid was not provided.');
  });
});
