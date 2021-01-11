import * as Types from '../types';
import { getDbRecordById, updateRecord } from '../db';

export const getUser: (id: string) => Promise<Types.IDbUser> = id => getDbRecordById('/users/', id);
export const createUser: (id: string, user: Types.IDbUser) => Promise<Types.IDbUser> = (id, data) => updateRecord('/users/', id, data);
