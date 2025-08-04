import { getAuth } from 'firebase/auth';
import { child, get, getDatabase, ref } from 'firebase/database';

import { getApp, type PassedHeaders } from '../serverApp';
import type { IDbUser, IUser } from '../../db-types';

export async function getUser(headers: PassedHeaders) {
  const firebaseServerApp = await getApp(headers);
  const auth = getAuth(firebaseServerApp);
  await auth.authStateReady();

  if (!auth.currentUser) {
    return {
      firebaseServerApp,
    };
  }

  const dbRef = ref(getDatabase(firebaseServerApp));

  try {
    const uid = auth.currentUser.uid;

    if (!uid) {
      throw new Error('Unknown user - no uid');
    }

    const snapshot = await get(child(dbRef, `users/${auth.currentUser.uid}`));

    if (!snapshot.exists()) {
      const displayName = auth.currentUser.displayName || 'no-name';
      const email = auth.currentUser.providerData[0].email || 'no-email';

      const data = {
        displayName,
        email,
        isAdmin: false,
      };

      if (!email.match('@pieroni.it')) {
        throw new Error(`Email not supported: ${email} - ${uid}`);
      }

      // need to create new user, log to be checked
      throw new Error(
        `User needs creation. Uid: ${uid}, data: ${JSON.stringify(data)}`
      );
    }

    const { nome, cognome, ...rest }: IDbUser = snapshot.val();
    const enrichedUser: IUser = {
      name: nome,
      surname: cognome,
      id: auth.currentUser.uid,
      ...rest,
    };

    return { firebaseServerApp, currentUser: enrichedUser };
  } catch (error) {
    console.error(error);
    return { firebaseServerApp };
  }
}
