import * as Types from '../../types';
import { addRecord, listenToDb, updateRecord } from '../../db';

export const listenToLinks: (callback: (hasError: boolean, data?: Types.ILink[]) => void) => void  = callback => listenToDb('/links', callback);
export const updateLink: (id: string, data: Types.ILink) => Promise<Types.ILink | Error> = async (id, data) => await updateRecord('/links', id, data);
export const addLink: (data: Types.ILink) => Promise<Types.ILink | Error> = async (data) => await addRecord('/links', data, true);
