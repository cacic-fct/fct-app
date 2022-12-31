import * as create_users from './create-users/create-users';

const isRunningOnEmulator = process.env.FUNCTIONS_EMULATOR && process.env.FIRESTORE_EMULATOR_HOST;

if (isRunningOnEmulator) {
  exports.create_users = create_users;
}
