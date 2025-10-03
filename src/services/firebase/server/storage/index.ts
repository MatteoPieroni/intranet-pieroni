import { PassedHeaders } from '../serverApp';
import { remove, upload } from './operations';

export const uploadLinkIcon = async (headers: PassedHeaders, file: File) => {
  try {
    const uploadFileUrl = await upload(headers, 'link-icons', file);
    return uploadFileUrl;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const uploadIssueAttachment = async (
  headers: PassedHeaders,
  issueId: string,
  file: File
) => {
  try {
    const uploadFileUrl = await upload(headers, `issues/${issueId}`, file);
    return uploadFileUrl;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const deleteIssueAttachment = async (
  headers: PassedHeaders,
  issueId: string,
  fileUrl: string
) => {
  try {
    await remove(headers, `issues/${issueId}`, fileUrl);
  } catch (e) {
    console.error(e);
    throw e;
  }
};
