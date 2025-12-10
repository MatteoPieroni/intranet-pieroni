import {
  child,
  get as firebaseGet,
  getDatabase,
  ref,
  update as firebaseUpdate,
} from 'firebase/database';

import { getApp, PassedAuth } from '../serverApp';

export const get = async <DbType>(authHeader: PassedAuth, address: string) => {
  const firebaseServerApp = await getApp(authHeader);
  const dbRef = ref(getDatabase(firebaseServerApp));

  const record = await firebaseGet(child(dbRef, `/${address}`));

  if (!record.exists()) {
    throw new Error(`Not found at ${address}`);
  }

  const data: DbType = record.val();

  return data;
};

export const update = async <DataType extends object>(
  authHeader: PassedAuth,
  address: string,
  data: DataType
) => {
  const firebaseServerApp = await getApp(authHeader);
  const db = getDatabase(firebaseServerApp);
  const dbRef = ref(db);

  await firebaseUpdate(child(dbRef, address), data);
};
