//  TODO: Fix this - Doesn't work

import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp } from 'firebase-admin/app';
import { ExplicitParameterValue, getRemoteConfig } from 'firebase-admin/remote-config';

// Attribution: amiregelz
// https://stackoverflow.com/questions/36759627/firebase-login-as-other-user/71808501#71808501*exports.impersonate = functions.https.onCall((data, context) => {

exports.impersonate = onCall(async (request): Promise<any> => {
  const data = request.data;
  const context = request;
  if (context.app == undefined) {
    throw new HttpsError('failed-precondition', 'The function must be called from an App Check verified app.');
  }

  // Check if request is made by an admin
  if (!context.auth) {
    throw new HttpsError('failed-precondition', 'The function must be called while authenticated.');
  }

  if (context.auth.token.role !== 1000) {
    throw new HttpsError('failed-precondition', 'The function must be called by an admin.');
  }

  const remoteConfig = getRemoteConfig();

  // Get whitelist array as string from remote config
  const template = await remoteConfig.getTemplate();
  const whitelist: string = (template.parameters.adminWhitelist.defaultValue as ExplicitParameterValue).value;

  // Check if email is included in whitelist array
  if (!whitelist.includes(data.email)) {
    throw new HttpsError('failed-precondition', 'You cannot impersonate an user.');
  }

  // TODO: https://stackoverflow.com/questions/48602546/google-cloud-functions-how-to-securely-store-service-account-private-key-when

  initializeApp({
    credential: undefined,
  });

  try {
    if (context.auth?.uid) {
      return getAuth()
        .getUser(context.auth.uid)
        .then(async (userRecord) => {
          if (userRecord.email && whitelist.includes(userRecord.email)) {
            const userId = data.uid;
            const customToken = await getAuth().createCustomToken(userId);
            return {
              token: customToken,
            };
          } else {
            throw new HttpsError('failed-precondition', 'You are not whitelisted.');
          }
        })
        .catch((error) => {
          return { message: `${error}` };
        });
    }
  } catch (error) {
    return { message: `${error}` };
  }

  return {
    message: `${data.email} has been impersonated`,
    success: true,
  };
});
