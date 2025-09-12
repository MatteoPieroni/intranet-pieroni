import { IDbUser } from '../../db-types';
import { PassedHeaders } from '../serverApp';
import { get } from './operations';

export const getUsers = async (headers: PassedHeaders) => {
  try {
    const records = await get<IDbUser>(headers, 'users');

    return records;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
