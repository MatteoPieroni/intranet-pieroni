import * as Types from '../types';
import { getDbRecords } from '../db';

export const getImages: () => Promise<Types.IImage[]> = () => getDbRecords('/images/');