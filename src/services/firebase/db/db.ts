import * as Types from './types';
import { fireApp } from '../app';
import { normaliseObjectKeysToArray } from '../../../utils/normaliseObjectKeysToArray';

const fireDb = fireApp.database();

interface IGetDbRecordByID {
  <T>(recordString: string, id: string): T;
  <T, P>(
    recordString: string,
    id: string,
    normaliser: (data: T) => P
  ): Promise<P>;
}

export const getDbRecordById: IGetDbRecordByID = <T, P = undefined>(
  recordString: string,
  id: string,
  normaliser?: (data: T) => P
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const ref = await fireDb.ref(`${recordString}/${id}`).once('value');

      resolve(
        typeof normaliser === 'function' ? normaliser(ref.val()) : ref.val()
      );
    } catch (error) {
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
    try {
      const ref = await fireDb.ref(recordString).once('value');
      const data =
        typeof normaliser === 'function' ? normaliser(ref.val()) : ref.val();

      resolve(data);
    } catch (error) {
      reject(error);
    }
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
    try {
      const ref = await fireDb.ref(recordString).once('value');
      const data =
        typeof normaliser === 'function'
          ? normaliser(ref.val())
          : normaliseObjectKeysToArray(ref.val());

      resolve(data);
    } catch (error) {
      reject(error);
    }
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
  try {
    fireDb.ref(recordString).on('value', (snapshot) => {
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
  } catch (error) {
    callback(true);
  }

  return (): void => fireDb.ref(recordString).off();
};

export const updateRecord = <T>(
  recordString: string,
  id: string,
  data: T
): Promise<T> => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('update', fireDb.ref(`${recordString}/${id}`));
      const update = await fireDb.ref(`${recordString}/${id}`).update(data);
      resolve(update);
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
    try {
      const newPostKey = fireDb.ref().child(recordString).push().key;
      const add = await fireDb.ref(`${recordString}/${newPostKey}`).update({
        ...data,
        ...(includeId && { id: newPostKey }),
      });

      resolve(add);
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
    try {
      await fireDb.ref(`${recordString}/${id}`).remove();

      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
