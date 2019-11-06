import * as Types from './types';
import { fireApp } from './app';

const fireAuth = fireApp.auth();

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

export const login: (data: Types.ILogin) => void | {} = async ({ email, password }) => {
  try {
    await fireAuth.signInWithEmailAndPassword(process.env.EMAIL, process.env.PASSWORD);
  } catch (error) {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
    return {
      errorCode,
      errorMessage,
    };
  }
};

export const logout: () => void = async () => await fireAuth.signOut();
