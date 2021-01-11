import * as Types from '../../types';
import { getDbRecordById, updateRecord } from '../../db';


export const getQuote: () => Promise<Types.IQuote> = () => getDbRecordById('/quote', 'active');
export const updateQuote: (data: Types.IQuote) => Promise<Types.IQuote | Error> = async (data) => await updateRecord('/quote', 'active', data);
