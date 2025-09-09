// import {
// 	child,
// 	get as firebaseGet,
// 	getDatabase,
// 	push as firebasePush,
// 	ref,
// 	remove as firebaseRemove,
// 	update as firebaseUpdate,
// } from 'firebase/database';
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  collection,
} from 'firebase/firestore';

import { getApp, PassedHeaders } from '../serverApp';

export const get = async <DbType>(
  currentHeaders: PassedHeaders,
  address: string
) => {
  const firebaseServerApp = await getApp(currentHeaders);
  const db = getFirestore(firebaseServerApp);

  const recordRef = doc(db, 'riscossi', `cEKWO4W6xxaBXkR6rvLa`);
  const record = await getDoc(recordRef);
  const subCollection = await getDocs(
    collection(db, 'riscossi', `cEKWO4W6xxaBXkR6rvLa`, 'riscossi_documents')
  );

  if (!record.exists()) {
    throw new Error(`Not found at ${address}`);
  }

  const data: unknown = record.data();

  subCollection.forEach((doc) => console.log(doc.data()));

  return data;
};

// export const update = async <DataType extends object>(
// 	currentHeaders: PassedHeaders,
// 	address: string,
// 	data: DataType
// ) => {
// 	const firebaseServerApp = await getApp(currentHeaders);
// 	const db = getDatabase(firebaseServerApp);
// 	const dbRef = ref(db);

// 	await firebaseUpdate(child(dbRef, address), data);
// };

// export const create = async <DbType>(
// 	headers: PassedHeaders,
// 	address: string,
// 	data: DbType
// ) => {
// 	const firebaseServerApp = await getApp(headers);
// 	const db = getDatabase(firebaseServerApp);
// 	const dbRef = ref(db);

// 	try {
// 		const newPostKey = firebasePush(child(dbRef, address)).key;

// 		const postData = {
// 			...data,
// 			id: newPostKey,
// 		};

// 		await firebaseUpdate(ref(db, `${address}/${newPostKey}`), postData);
// 	} catch (e) {
// 		throw e;
// 	}
// };

// export const remove = async (
// 	headers: PassedHeaders,
// 	address: string,
// 	id: string
// ) => {
// 	const firebaseServerApp = await getApp(headers);
// 	const db = getDatabase(firebaseServerApp);

// 	try {
// 		await firebaseRemove(ref(db, `${address}/${id}`));
// 	} catch (e) {
// 		throw e;
// 	}
// };
