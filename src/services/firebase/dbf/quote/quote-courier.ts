import * as Types from '../../types';
import { getDbRecordById } from '../../db';


export const getQuote: () => Promise<Types.IQuote> = () => getDbRecordById('/quote', 'active');
