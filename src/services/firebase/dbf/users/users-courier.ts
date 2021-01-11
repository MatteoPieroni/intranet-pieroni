import * as Types from '../../types';
import { getDbRecordById, updateRecord } from '../../db';

export const getUser: (id: string) => Promise<Types.IDbUser | Error> = id => getDbRecordById('/users/', id);
export const createUser: (id: string, user: Types.IDbUser) => Promise<Types.IDbUser | Error> = (id, data) => updateRecord('/users/', id, data);
