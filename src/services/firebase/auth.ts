import { fireApp, microsoftProvider } from './app';
import {
  FORM_FAIL_LOGIN_NO_USER,
  FORM_FAIL_LOGIN,
  FORM_FAIL_LOGIN_POPUP_CLOSED
} from '../../common/consts';

const fireAuth = fireApp.auth();
fireAuth.languageCode = 'it';

microsoftProvider.setCustomParameters({
  tenant: "pieroni.it",
  'login_hint': '@pieroni.it',
});

export const getCurrentUser: () => firebase.User = () => fireAuth.currentUser;

type Subscriber = (user: firebase.User | null) => void;

export const subscribeToAuthChanges: (subscriber: Subscriber) => firebase.Unsubscribe = subscriber => (
  fireAuth.onAuthStateChanged(user => {
    if (user) {
      subscriber(user);
    } else {
      subscriber(null);
    }
  })
);

export enum ELoginErrors {
  noUser = 'auth/user-not-found',
  wrongEmail = 'auth/invalid-email',
}

export const loginErrorHandling: (code: keyof ELoginErrors) => string = (codes) => {
  switch (codes) {
    case 'auth/user-not-found':
      return FORM_FAIL_LOGIN_NO_USER
    case 'auth/popup-closed-by-user':
      return FORM_FAIL_LOGIN_POPUP_CLOSED;
    default:
      return FORM_FAIL_LOGIN;
  }
}

export const loginWithMicrosoft: () => void | {} = async () => {
  try {
    await fireAuth.signInWithPopup(microsoftProvider);
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = loginErrorHandling(errorCode);

    throw new Error(
      errorMessage
    );
  }
};

export const logout: () => Promise<void> = async () => await fireAuth.signOut();

export const getToken: () => Promise<string> = async () => {
  try {
    const token = await fireAuth.currentUser.getIdToken(true)

    return token;
  } catch (e) {
    console.error(e);
  }
}
