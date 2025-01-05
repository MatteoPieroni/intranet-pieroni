import * as Types from '../../db-types';
import { normaliseObjectKeysToArray } from '@/utils/normaliseObjectKeysToArray';
import {
  child,
  get,
  getDatabase,
  off,
  onValue,
  push,
  ref,
  remove,
  update,
} from 'firebase/database';

export const getDbRecordById = <T, P = undefined>(
  recordString: string,
  id: string,
  normaliser?: (data: T) => P
): Promise<P> => {
  return new Promise(async (resolve, reject) => {
    const dbRef = ref(getDatabase());

    try {
      const snapshot = await get(child(dbRef, `${recordString}/${id}`));
      if (snapshot.exists()) {
        resolve(
          typeof normaliser === 'function'
            ? normaliser(snapshot.val())
            : snapshot.val()
        );
      } else {
        console.log('No data available');
        reject();
      }
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

type IGetDbRecord = {
  <T>(recordString: string): Promise<T>;
  <T, P>(recordString: string, normaliser: (data: T) => P): Promise<P>;
};

export const getDbRecord: IGetDbRecord = <T, P = undefined>(
  recordString: string,
  normaliser?: (data: T) => P
) => {
  return new Promise(async (resolve, reject) => {
    const dbRef = ref(getDatabase());

    get(child(dbRef, recordString))
      .then((snapshot) => {
        if (snapshot.exists()) {
          resolve(
            typeof normaliser === 'function'
              ? normaliser(snapshot.val())
              : snapshot.val()
          );
        } else {
          console.log('No data available');
          reject();
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

type IGetDbRecords = {
  <T>(recordString: string): Promise<T>;
  <T, P>(recordString: string, normaliser: (data: T) => P): Promise<P>;
};

export const getDbRecords: IGetDbRecords = <T, P = undefined>(
  recordString: string,
  normaliser?: (data: T) => P
) => {
  return new Promise(async (resolve, reject) => {
    const dbRef = ref(getDatabase());

    get(child(dbRef, recordString))
      .then((snapshot) => {
        if (snapshot.exists()) {
          resolve(
            typeof normaliser === 'function'
              ? normaliser(snapshot.val())
              : normaliseObjectKeysToArray(snapshot.val())
          );
        } else {
          console.log('No data available');
          reject();
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export type CancellableListener = () => void;

type IListenToDb = {
  <T>(
    recordString: string,
    callback: (hasError: boolean, data: T[]) => void
  ): CancellableListener;
  <T, P>(
    recordString: string,
    callback: (hasError: boolean, data?: P) => void,
    normaliser: (data: T) => P
  ): CancellableListener;
};

export const listenToDb: IListenToDb = <
  T,
  P extends Types.IRecord<T>,
  Q = undefined
>(
  recordString: string,
  callback: (hasError: boolean, data?: T[] | Q) => void,
  normaliser?: (data: P) => Q
) => {
  const db = getDatabase();
  const dbRef = ref(db, recordString);

  try {
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      const hasData = !!data;

      if (hasData) {
        callback(
          false,
          typeof normaliser === 'function'
            ? normaliser(data)
            : normaliseObjectKeysToArray<T, P>(data)
        );
      } else {
        callback(false);
      }
    });
  } catch (e) {
    console.log(e);
    callback(true);
  }

  return (): void => off(dbRef);
};

export const updateRecord = <T extends object>(
  recordString: string,
  id: string,
  data: T
): Promise<T> => {
  return new Promise(async (resolve, reject) => {
    const db = getDatabase();
    const dbRef = ref(db);

    try {
      console.log('update', child(dbRef, `${recordString}/${id}`));
      await update(child(dbRef, `${recordString}/${id}`), data);
      resolve(data);
    } catch (e) {
      reject(e);
    }
  });
};

export const addRecord = <T>(
  recordString: string,
  data: T,
  includeId: boolean
): Promise<T> => {
  return new Promise(async (resolve, reject) => {
    const db = getDatabase();
    const dbRef = ref(db);

    try {
      const newPostKey = push(child(dbRef, recordString)).key;

      const postData = {
        ...data,
        ...(includeId && { id: newPostKey }),
      };

      await update(ref(db, `${recordString}/${newPostKey}`), postData);

      resolve(postData);
    } catch (e) {
      reject(e);
    }
  });
};

export const removeRecord = (
  recordString: string,
  id: string
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    const db = getDatabase();

    try {
      await remove(ref(db, `${recordString}/${id}`));

      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
