import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';

import { getApp, PassedAuth } from '../serverApp';
import { FileCategories } from '../../db-types';

export const upload = async (
  authHeader: PassedAuth,
  category: FileCategories,
  file: File
) => {
  const firebaseServerApp = await getApp(authHeader);
  const storage = getStorage(firebaseServerApp);

  const storageRef = ref(storage, `${category}/${file.name}`);

  await uploadBytes(storageRef, file);

  const fileUrl = await getDownloadURL(storageRef);

  return fileUrl;
};

export const remove = async (authHeader: PassedAuth, fileUrl: string) => {
  const firebaseServerApp = await getApp(authHeader);
  const storage = getStorage(firebaseServerApp);

  const storageRef = ref(storage, fileUrl);

  await deleteObject(storageRef);
};
