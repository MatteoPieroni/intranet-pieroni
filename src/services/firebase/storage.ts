import * as Types from './db';
import { fireApp } from './app';

const fireStorage = fireApp.storage();

export const getFileDownloadUrl: (fileUrl: string) => Promise<string> = async (url) => {
  const ref = fireStorage.refFromURL(url);
  const fireUrl = await ref.getDownloadURL();

  return fireUrl;
}
