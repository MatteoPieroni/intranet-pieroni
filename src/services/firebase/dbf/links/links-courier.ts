import * as Types from '../../types';
import { listenToDb } from '../../db';

export const listenToLinks: (callback: (hasError: boolean, data?: Types.ILink[]) => void) => void  = callback => listenToDb('/links', callback);
