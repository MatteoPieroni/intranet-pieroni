import * as Types from './types';
import { fireApp, microsoftProvider } from './app';
import { FORM_FAIL_LOGIN_NO_USER, FORM_FAIL_LOGIN_EMAIL_BAD_FORMATTED, FORM_FAIL_LOGIN, FORM_FAIL_RESET_NO_USER, FORM_FAIL_RESET } from '../../common/consts';

const fireAuth = fireApp.auth();
fireAuth.languageCode = 'it';

microsoftProvider.setCustomParameters({
  tenant: "pieroni.it",
  'login_hint': '@pieroni.it',
});

export const getCurrentUser: () => firebase.User = () => fireAuth.currentUser;

export const subscribeToAuthChanges: (subscriber: Types.Subscriber) => firebase.Unsubscribe = subscriber => (
  fireAuth.onAuthStateChanged(user => {
    if (user) {
      subscriber(user);
    } else {
      subscriber(null);
    }
  })
);

export const loginErrorHandling: (code: keyof Types.ELoginErrors) => string = (codes) => {
  switch (codes) {
    case 'auth/user-not-found':
      return FORM_FAIL_LOGIN_NO_USER
    case 'auth/invalid-email':
      return FORM_FAIL_LOGIN_EMAIL_BAD_FORMATTED
    default:
      return FORM_FAIL_LOGIN;
  }
}

export const resetErrorHandling: (code: keyof Types.EResetErrors) => string = (codes) => {
  switch (codes) {
    case 'auth/user-not-found':
      return FORM_FAIL_RESET_NO_USER
    default:
      return FORM_FAIL_RESET;
  }
}

export const login: (data: Types.ILogin) => void | {} = async ({ email, password }) => {
  try {
    await fireAuth.signInWithEmailAndPassword(email, password);
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = loginErrorHandling(errorCode);

    throw new Error(
      errorMessage
    );
  }
};

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

export const passwordReset: (email: string) => Promise<void> = async (email) => {
  try {
    await fireAuth.sendPasswordResetEmail(email);
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = resetErrorHandling(errorCode);

    throw new Error(
      errorMessage
    );
  }
};