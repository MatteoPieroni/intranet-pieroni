import { PassedHeaders } from '../serverApp';
import { upload } from './operations';

export const uploadLinkIcon = async (headers: PassedHeaders, file: File) => {
  try {
    const uploadFileUrl = await upload(headers, 'link-icons', file);
    return uploadFileUrl;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
