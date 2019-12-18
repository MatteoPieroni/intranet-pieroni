import * as Types from './types';
import { fireApp } from './app';

const fireStorage = fireApp.storage();

const listFiles: (folderString: string) => Promise<Types.IStorageFile[]> = (folderString) => {
  return new Promise(async (resolve, reject) => {
    try {
      const filesRef = fireStorage.ref().child(folderString);

      const allFilesRef = await filesRef.listAll();
      const allFiles = allFilesRef.items.map(file => file && { path: file.fullPath });
      resolve(allFiles);
    } catch (e) {
      reject(e);
    }
  });
};

export const listImages = async () => await listFiles('/images');