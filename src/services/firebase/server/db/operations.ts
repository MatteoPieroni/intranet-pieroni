import {
  child,
  get as firebaseGet,
  getDatabase,
  ref,
  update as firebaseUpdate,
} from 'firebase/database';

import { getApp, PassedHeaders } from '../serverApp';

export const get = async <DbType>(
  currentHeaders: PassedHeaders,
  address: string
) => {
  const firebaseServerApp = await getApp(currentHeaders);
  const dbRef = ref(getDatabase(firebaseServerApp));

  const record = await firebaseGet(child(dbRef, `/${address}`));

  if (!record.exists()) {
    throw new Error(`Not found at ${address}`);
  }

  const data: DbType = record.val();

  return data;
};

export const update = async <DataType extends object>(
  currentHeaders: PassedHeaders,
  address: string,
  data: DataType
) => {
  const firebaseServerApp = await getApp(currentHeaders);
  const db = getDatabase(firebaseServerApp);
  const dbRef = ref(db);

  await firebaseUpdate(child(dbRef, address), data);
};
