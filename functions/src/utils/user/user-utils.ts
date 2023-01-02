import * as functions from 'firebase-functions';
import { getAuth } from 'firebase-admin/auth';

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

  data.string = formatPhoneNumber(data.string);

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

exports.deleteUser = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
  }

  if (context.app == undefined) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called from an App Check verified app.'
    );
  }

  if (context.auth.token.role != 1000) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called by an admin.');
  }

  if (data.string === '') {
    return { message: 'Invalid argument: A string must be provided.' };
  }

  return getAuth()
    .deleteUser(data.uid)
    .then(() => {
      return { status: 'ok' };
    })
    .catch((error) => {
      return { message: `${error}` };
    });
});

exports.getUserProfile = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
  }

  if (context.app == undefined) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called from an App Check verified app.'
    );
  }

  if (context.auth.token.role != 1000) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called by an admin.');
  }

  if (data.string === '') {
    return { message: 'Invalid argument: A string must be provided.' };
  }

  if (data.string.includes('@')) {
    return getAuth()
      .getUserByEmail(data.string)
      .then((user) => {
        return user.toJSON();
      })
      .catch((error) => {
        return { message: `${error}` };
      });
  }

  // Remove spaces from the string
  data.string = data.string.replace(/\s/g, '');

  // Check if input has only one '+' and numbers
  const isNumeric: boolean = /^\+?\d+$/.test(data.string);

  // If string has letters, assume it's a UID
  // This fails if UID only has numbers
  if (!isNumeric) {
    return getAuth()
      .getUser(data.string)
      .then((user) => {
        return user.toJSON();
      })
      .catch((error) => {
        return { message: `${error}` };
      });
  }

  if (data.string.length < 11 || data.string.length > 14) {
    return { message: 'Invalid argument: Invalid input' };
  }

  data.string = formatPhoneNumber(data.string);

  return getAuth()
    .getUserByPhoneNumber(data.string)
    .then((user) => {
      return user.toJSON();
    })
    .catch((error) => {
      return { message: `${error}` };
    });
});

function formatPhoneNumber(phoneNumber: string): string {
  if (phoneNumber.length === 11) {
    return `+55${phoneNumber}`;
  }

  if (phoneNumber.length === 13) {
    return `+${phoneNumber}`;
  }

  return phoneNumber;
}
