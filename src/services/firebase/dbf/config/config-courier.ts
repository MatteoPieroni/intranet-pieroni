import * as Types from '../../types';
import { GetDbRecords } from '../../db';

export const getConfig: Types.GetDbCollection = () => GetDbRecords('/config');