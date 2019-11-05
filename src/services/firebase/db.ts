import * as Types from './types';
import { fireApp } from './app';

const fireDb = fireApp.database();

export const getUser: Types.GetUser = id => {
  return new Promise(async (resolve, reject) => {
    try {
      const ref = await fireDb.ref(`/users/${id}`).once('value');

      resolve(ref.val());
    } catch (error) {
      reject(error);
    }
  });
};
