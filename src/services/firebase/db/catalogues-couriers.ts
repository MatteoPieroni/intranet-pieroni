import * as Types from '../types';
import { listenToDb } from '../db';

export const listenToCatalogues: Types.ListenToDbCollection = (callback) => listenToDb('/catalogues', callback);
export const listenToFolders: Types.ListenToDbCollection = (callback) => listenToDb('/folders', callback);
