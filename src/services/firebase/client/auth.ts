'use client';

import {
  OAuthProvider,
  signInWithPopup,
  onAuthStateChanged as _onAuthStateChanged,
  type NextOrObserver,
  type User,
} from 'firebase/auth';

import { auth } from './clientApp';
import {
  FORM_FAIL_LOGIN,
  FORM_FAIL_LOGIN_NO_USER,
  FORM_FAIL_LOGIN_POPUP_CLOSED,
} from '@/consts';

const microsoftProvider = new OAuthProvider('microsoft.com');
microsoftProvider.setCustomParameters({
  tenant: 'pieroni.it',
  login_hint: '@pieroni.it',
});

export function onAuthStateChanged(cb: NextOrObserver<User>) {
  return _onAuthStateChanged(auth, cb);
}

export const loginErrors = [
  'auth/user-not-found',
  'auth/invalid-email',
  'auth/popup-closed-by-user',
] as const;

export const getLoginError = (codes: string) => {
  switch (codes) {
    case 'auth/user-not-found':
      return FORM_FAIL_LOGIN_NO_USER;
    case 'auth/popup-closed-by-user':
      return FORM_FAIL_LOGIN_POPUP_CLOSED;
    default:
      return FORM_FAIL_LOGIN;
  }
};

export async function signInWithGoogle() {
  try {
    await signInWithPopup(auth, microsoftProvider);
  } catch (error) {
    console.error('Error signing in', error);

    if (
      error instanceof Object &&
      'code' in error &&
      typeof error.code === 'string'
    ) {
      throw new Error(getLoginError(error.code));
    }

    throw new Error(FORM_FAIL_LOGIN);
  }
}

export async function signOut() {
  try {
    return auth.signOut();
  } catch (error) {
    console.error('Error signing out', error);
    throw new Error("Errore nell'uscita");
  }
}
