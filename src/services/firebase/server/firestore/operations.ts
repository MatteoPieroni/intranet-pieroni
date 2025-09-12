import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDocs,
  getFirestore,
  setDoc,
} from 'firebase/firestore';

import { getApp, PassedHeaders } from '../serverApp';

export const get = async <DbType extends DocumentData>(
  currentHeaders: PassedHeaders,
  address: string
) => {
  const firebaseServerApp = await getApp(currentHeaders);
  const db = getFirestore(firebaseServerApp);

  const querySnapshot = await getDocs<DbType, DbType>(collection(db, address));

  const data: DbType[] = [];

  querySnapshot.forEach((doc) => {
    data.push(doc.data());
  });

  return data;
};

export const update = async <DbType extends DocumentData>(
  headers: PassedHeaders,
  address: string | string[],
  data: DbType
) => {
  const firebaseServerApp = await getApp(headers);
  const db = getFirestore(firebaseServerApp);
  const fullAddress = typeof address === 'string' ? [address] : address;

  try {
    await setDoc<DbType, DbType>(doc(db, ...fullAddress), data);
  } catch (e) {
    throw e;
  }
};
export const create = async <DbType extends DocumentData>(
  headers: PassedHeaders,
  address: string,
  data: DbType
) => {
  const firebaseServerApp = await getApp(headers);
  const db = getFirestore(firebaseServerApp);

  try {
    const docRef = await addDoc<DbType, DbType>(collection(db, address), data);

    return docRef;
  } catch (e) {
    throw e;
  }
};
