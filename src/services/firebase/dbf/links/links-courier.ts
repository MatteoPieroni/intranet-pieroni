import * as Types from '../../types';
import { listenToDb, updateRecord } from '../../db';

export const listenToLinks: (callback: (hasError: boolean, data?: Types.ILink[]) => void) => void  = callback => listenToDb('/links', callback);
export const updateLink: (id: string, data: Types.ILink) => Promise<Types.ILink | Error> = async (id, data) => await updateRecord('/links', id, data);
