import * as Types from './types';
import { fireApp } from './app';
import { normaliseObjectKeysToArray } from '../../utils/normaliseObjectKeysToArray';

const fireDb = fireApp.database();

const GetDbRecordById: Types.GetDbRecordById = (recordString, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const ref = await fireDb.ref(`${recordString}/${id}`).once('value');

      resolve(ref.val());
    } catch (error) {
      reject(error);
    }
  });
};

export const getUser: (id: string) => Promise<Types.IDbUser> = id => GetDbRecordById('/users/', id);
export const getQuote: () => Promise<Types.IQuote> = () => GetDbRecordById('/quote', 'active');

const GetDbRecords: Types.GetDbRecords = recordString => {
  return new Promise(async (resolve, reject) => {
    try {
      const ref = await fireDb.ref(recordString).once('value');

      resolve(ref.val());
    } catch (error) {
      reject(error);
    }
  });
};

const listenToDb: Types.ListenToDb = (recordString, callback) => {
  try {
    fireDb.ref(recordString).on('value', snapshot => {
      const data: any = snapshot.val();
      const hasData: boolean = !!data;

      if (hasData) {
        callback(false, normaliseObjectKeysToArray(data));
      } else {
        callback(false);
      }
    });
  } catch (error) {
    callback(true);
  }

  return () => fireDb.ref(recordString).off();
};

export const listenToLinks: Types.ListenToDbCollection = callback => listenToDb('/links', callback);
