import * as Types from '../../types';
import { addRecord } from '../../db';

export const addSms: (data: Types.IDbSms) => Promise<Types.IDbSms | Error> = async (data) => await addRecord('/sms', data, false);
