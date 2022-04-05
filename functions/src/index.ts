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
  /*if (context.auth.token.admin !== true) {
        return {
            message: 'Only admins can add other admins'
        }
    }*/

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
