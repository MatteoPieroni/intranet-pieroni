import * as Types from '../types';
import { getDbRecordById, updateRecord } from '../db';

export const getTvText: () => Promise<Types.ITv> = () =>
  getDbRecordById('/tv', 'active');
export const updateTvText: (data: Types.ITv) => Promise<Types.ITv> = async (
  data
) => await updateRecord('/tv', 'active', data);
