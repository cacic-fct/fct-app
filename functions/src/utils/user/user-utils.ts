import * as functions from 'firebase-functions';
import { getAuth } from 'firebase-admin/auth';
import { StringDataReturnType } from '../../shared/return-types';

// Attribution: The Net Ninja
// https://youtube.com/watch?v=VvcBqPua2DI&list=PL4cUxeGkcC9jUPIes_B8vRjn1_GaplOPQ

exports.getUserUid = functions.https.onCall(async (data, context): Promise<StringDataReturnType> => {
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
    return { message: 'Invalid argument: A string must be provided.', success: false };
  }

  if (data.string.includes('@')) {
    try {
      const user = await getAuth().getUserByEmail(data.string);
      return {
        data: user.uid,
        success: true,
        message: 'User found by email',
      };
    } catch (error) {
      return { message: `${error}`, success: false };
    }
  }
  // Remove spaces from the string
  data.string = data.string.replace(/\s/g, '');

  // Check if input has only one '+' and numbers
  const isNumeric: boolean = /^\+?\d+$/.test(data.string);

  // Check if string only has numbers
  if (!isNumeric) {
    return { message: 'Invalid argument: Invalid input', success: false };
  }

  if (data.string.length < 11 || data.string.length > 14) {
    return { message: 'Invalid argument: Invalid input', success: false };
  }

  if (data.string.length === 11) {
    data.string = `+55${data.string}`;
  } else if (data.string.length === 13) {
    data.string = `+${data.string}`;
  }

  try {
    const user = await getAuth().getUserByPhoneNumber(data.string);
    return {
      data: user.uid,
      success: true,
      message: 'User found by phone number',
    };
  } catch (error) {
    return { message: `${error}`, success: false };
  }
});
