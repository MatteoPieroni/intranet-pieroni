import 'server-only';

import { headers as nextHeaders } from 'next/headers';
import { initializeServerApp } from 'firebase/app';

import { firebaseConfig } from '../config';
import { getAuth } from 'firebase/auth';

export type PassedAuth = string | null;

export async function getApp(headers: PassedAuth) {
  const idToken = headers?.split('Bearer ')[1];
  const firebaseServerApp = initializeServerApp(
    firebaseConfig,
    idToken
      ? {
          authIdToken: idToken,
        }
      : {}
  );
  const auth = getAuth(firebaseServerApp);
  await auth.authStateReady();

  return firebaseServerApp;
}
