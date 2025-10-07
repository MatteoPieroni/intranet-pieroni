import { getAuth } from 'firebase/auth';

import { getApp, type PassedHeaders } from '../serverApp';
import type { DbUser, User } from '../../db-types';
import {
  doc,
  getDoc,
  getFirestore,
  QueryDocumentSnapshot,
} from 'firebase/firestore';

export const USER_ACTIVATION_ERROR = 'USER_404';

export async function getUser(headers: PassedHeaders) {
  const firebaseServerApp = await getApp(headers);
  const auth = getAuth(firebaseServerApp);
  await auth.authStateReady();

  if (!auth.currentUser) {
    return {
      firebaseServerApp,
    };
  }

  const db = getFirestore(firebaseServerApp);

  try {
    const uid = auth.currentUser.uid;

    if (!uid) {
      throw new Error('Unknown user - no uid');
    }

    const userRef = doc(db, 'users', uid).withConverter(
      (() => ({
        // this is just for types
        toFirestore: (data: User) => data,
        fromFirestore: (snap: QueryDocumentSnapshot<DbUser, DbUser>) => {
          const data = snap.data();

          return data;
        },
      }))()
    );
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      const displayName = auth.currentUser.displayName || 'no-name';
      const email = auth.currentUser.providerData[0].email || 'no-email';

      const data = {
        displayName,
        email,
      };

      if (!email.match('@pieroni.it')) {
        throw new Error(`Email not supported: ${email} - ${uid}`);
      }

      // need to create new user, log to be checked
      console.error(
        `User needs creation. Uid: ${uid}, data: ${JSON.stringify(data)}`
      );

      return { firebaseServerApp, error: { code: 'USER_404', email, uid } };
    }

    const user = snapshot.data();

    return { firebaseServerApp, currentUser: user };
  } catch (error) {
    console.error(error);
    return { firebaseServerApp };
  }
}
