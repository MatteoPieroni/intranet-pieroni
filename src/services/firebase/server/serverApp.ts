import 'server-only';

import { headers as nextHeaders } from 'next/headers';
import { initializeServerApp } from 'firebase/app';

import { firebaseConfig } from '../config';
import { getAuth } from 'firebase/auth';

export type PassedHeaders = Awaited<ReturnType<typeof nextHeaders>>;

export async function getApp(headers: PassedHeaders) {
  const idToken = headers.get('Authorization')?.split('Bearer ')[1];
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
