import {
  collection,
  DocumentData,
  getDocs,
  getFirestore,
  QueryDocumentSnapshot,
  WithFieldValue,
} from 'firebase/firestore';

import { getApp, PassedHeaders } from '../serverApp';

const converter = <T>(dto?: (snap: DocumentData) => T) => ({
  toFirestore: (data: WithFieldValue<T>) => data,
  // can we make this better? I don't like casting
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    return typeof dto === 'function'
      ? // we always want the id with a record
        dto({ ...snap.data(), id: snap.id })
      : ({ ...snap.data(), id: snap.id } as T);
  },
});

export const getRecords = async <Type extends DocumentData>(
  currentHeaders: PassedHeaders,
  address: string,
  dto?: (dbData: DocumentData) => Type
) => {
  const firebaseServerApp = await getApp(currentHeaders);
  const db = getFirestore(firebaseServerApp);

  const querySnapshot = await getDocs(
    collection(db, address).withConverter(converter<Type>(dto))
  );

  const data: Type[] = [];

  querySnapshot.forEach((doc) => {
    data.push(doc.data());
  });

  return data;
};

// export const update = async <DbType extends DocumentData>(
//   headers: PassedHeaders,
//   address: string | string[],
//   data: DbType
// ) => {
//   const firebaseServerApp = await getApp(headers);
//   const db = getFirestore(firebaseServerApp);
//   const fullAddress = typeof address === 'string' ? [address] : address;

//   try {
//     await setDoc<DbType, DbType>(doc(db, ...fullAddress), data);
//   } catch (e) {
//     throw e;
//   }
// };

// export const create = async <DbType extends DocumentData>(
//   headers: PassedHeaders,
//   address: string,
//   data: DbType
// ) => {
//   const firebaseServerApp = await getApp(headers);
//   const db = getFirestore(firebaseServerApp);

//   try {
//     const docRef = await addDoc<DbType, DbType>(collection(db, address), data);

//     return docRef;
//   } catch (e) {
//     throw e;
//   }
// };
