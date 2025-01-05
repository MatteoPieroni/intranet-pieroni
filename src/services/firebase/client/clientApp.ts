'use client';

import { initializeApp, getApps } from 'firebase/app';
import { firebaseConfig } from '../config';
import { getAuth } from 'firebase/auth';

type ClientConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
};

export const clientConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
} satisfies ClientConfig;

export const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(firebaseApp);
auth.languageCode = 'it';
