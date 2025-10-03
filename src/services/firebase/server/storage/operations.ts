import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';

import { getApp, PassedHeaders } from '../serverApp';
import { IFileCategories } from '../../db-types';

export const upload = async (
  currentHeaders: PassedHeaders,
  category: IFileCategories,
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
  category: IFileCategories,
  fileUrl: string
) => {
  const firebaseServerApp = await getApp(currentHeaders);
  const storage = getStorage(firebaseServerApp);

  const storageRef = ref(storage, `${category}/${fileUrl}`);

  await deleteObject(storageRef);
};
