import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  QueryDocumentSnapshot,
  UpdateData,
  updateDoc,
  where,
  WithFieldValue,
  getCountFromServer,
  limit,
} from 'firebase/firestore';

import { getApp, PassedAuth } from '../serverApp';

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
  authHeader: PassedAuth,
  address: string | string[],
  dto?: (dbData: DocumentData) => Type,
  options?: {
    orderData?: { field: string; direction: 'asc' | 'desc' };
    queryData?:
      | { field: string; value: unknown }
      | { field: string; value: unknown }[];
    limit?: number;
  }
) => {
  const firebaseServerApp = await getApp(authHeader);
  const db = getFirestore(firebaseServerApp);
  const fullAddress = typeof address === 'string' ? [address] : address;
  // doc typing is a bit dumb, so we gotta do this
  const [first, ...rest] = fullAddress;

  const collectionRef = collection(db, first, ...rest).withConverter(
    converter<Type>(dto)
  );

  const queryArray = Array.isArray(options?.queryData)
    ? options.queryData
    : options?.queryData
    ? [options.queryData]
    : undefined;

  const queries = queryArray
    ? queryArray.map((query) => where(query.field, '==', query.value))
    : [];

  const args = [
    ...queries,
    options?.orderData
      ? orderBy(options.orderData.field, options.orderData.direction)
      : undefined,
    options?.limit ? limit(options.limit) : undefined,
  ].filter((current) => current !== undefined);

  const q = query(collectionRef, ...args);

  const querySnapshot = await getDocs(q);

  const data: Type[] = [];

  querySnapshot.forEach((doc) => {
    data.push(doc.data());
  });

  return data;
};

export const getRecordsCount = async (
  authHeader: PassedAuth,
  address: string | string[],
  options?: {
    queryData?: { field: string; value: unknown; operator?: '==' | '!=' };
  }
) => {
  const firebaseServerApp = await getApp(authHeader);
  const db = getFirestore(firebaseServerApp);
  const fullAddress = typeof address === 'string' ? [address] : address;
  // doc typing is a bit dumb, so we gotta do this
  const [first, ...rest] = fullAddress;

  const collectionRef = collection(db, first, ...rest);

  const args = [
    options?.queryData
      ? where(
          options.queryData.field,
          options.queryData.operator || '==',
          options.queryData.value
        )
      : undefined,
  ].filter((current) => current !== undefined);

  const q = query(collectionRef, ...args);

  const count = await getCountFromServer(q);

  return count.data().count;
};

export const getRecordsWhereArrayToArray = async <Type extends DocumentData>(
  authHeader: PassedAuth,
  address: string,
  queryData: { field: string; array: string[] },
  dto?: (dbData: DocumentData) => Type
) => {
  const firebaseServerApp = await getApp(authHeader);
  const db = getFirestore(firebaseServerApp);

  const collectionRef = collection(db, address).withConverter(
    converter<Type>(dto)
  );

  const q = query(
    collectionRef,
    where(queryData.field, 'array-contains-any', queryData.array)
  );

  const querySnapshot = await getDocs(q);

  const data: Type[] = [];

  querySnapshot.forEach((doc) => {
    data.push(doc.data());
  });

  return data;
};

export const get = async <Type extends DocumentData>(
  headers: PassedAuth,
  address: string | string[],
  dto?: (dbData: DocumentData) => Type
) => {
  const firebaseServerApp = await getApp(headers);
  const db = getFirestore(firebaseServerApp);
  const fullAddress = typeof address === 'string' ? [address] : address;
  // doc typing is a bit dumb, so we gotta do this
  const [first, ...rest] = fullAddress;

  try {
    const docRef = doc(db, first, ...rest).withConverter(converter<Type>(dto));
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('404');
    }

    return docSnap.data();
  } catch (e) {
    throw e;
  }
};

export const update = async <Type extends DocumentData>(
  headers: PassedAuth,
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
  headers: PassedAuth,
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
  headers: PassedAuth,
  address: string | string[],
  id: string
) => {
  const firebaseServerApp = await getApp(headers);
  const db = getFirestore(firebaseServerApp);

  const fullAddress = typeof address === 'string' ? [address] : address;
  // doc typing is a bit dumb, so we gotta do this
  const [first, ...rest] = fullAddress;

  try {
    const docToDelete = doc(db, first, ...rest, id);

    const docRef = await deleteDoc(docToDelete);

    return docRef;
  } catch (e) {
    throw e;
  }
};
