import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  getFirestore,
  QueryDocumentSnapshot,
  UpdateData,
  updateDoc,
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

export const update = async <Type extends DocumentData>(
  headers: PassedHeaders,
  address: string | string[],
  data: UpdateData<Type>,
  dto?: (dbData: DocumentData) => Type
) => {
  const firebaseServerApp = await getApp(headers);
  const db = getFirestore(firebaseServerApp);
  const fullAddress = typeof address === 'string' ? [address] : address;
  // doc typing is a bit dumb, so we gotta do this
  const [first, ...rest] = fullAddress;

  try {
    const docToUpdate = doc(db, first, ...rest).withConverter(
      converter<Type>(dto)
    );

    await updateDoc(docToUpdate, data);
  } catch (e) {
    throw e;
  }
};

export const create = async <Type extends DocumentData>(
  headers: PassedHeaders,
  address: string,
  data: Type,
  dto?: (dbData: DocumentData) => Type
) => {
  const firebaseServerApp = await getApp(headers);
  const db = getFirestore(firebaseServerApp);

  try {
    const collectionRef = collection(db, address).withConverter(
      converter<Type>(dto)
    );

    const docRef = await addDoc(collectionRef, data);

    return docRef;
  } catch (e) {
    throw e;
  }
};

export const remove = async (
  headers: PassedHeaders,
  address: string,
  id: string
) => {
  const firebaseServerApp = await getApp(headers);
  const db = getFirestore(firebaseServerApp);

  try {
    const docToDelete = doc(db, address, id);

    const docRef = await deleteDoc(docToDelete);

    return docRef;
  } catch (e) {
    throw e;
  }
};
