import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';

import { getApp, PassedHeaders } from '../serverApp';
import { FileCategories } from '../../db-types';

export const upload = async (
  currentHeaders: PassedHeaders,
  category: FileCategories,
  file: File
) => {
  const firebaseServerApp = await getApp(currentHeaders);
  const storage = getStorage(firebaseServerApp);

  const storageRef = ref(storage, `${category}/${file.name}`);

  await uploadBytes(storageRef, file);

  const fileUrl = await getDownloadURL(storageRef);

  return fileUrl;
};

export const remove = async (
  currentHeaders: PassedHeaders,
  fileUrl: string
) => {
  const firebaseServerApp = await getApp(currentHeaders);
  const storage = getStorage(firebaseServerApp);

  const storageRef = ref(storage, fileUrl);

  await deleteObject(storageRef);
};
