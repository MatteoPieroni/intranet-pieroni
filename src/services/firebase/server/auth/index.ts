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
    const snapshot = await get(child(dbRef, `users/${auth.currentUser.uid}`));
    if (!snapshot.exists()) {
      throw new Error('Unknown user');
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
