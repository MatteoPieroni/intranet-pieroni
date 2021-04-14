import * as Types from '../types';
import { CancellableListener, listenToDb } from '../db';

export type ICatalogueListener = (callback: (hasError: boolean, data?: Types.IFile[]) => void, normaliser: (data: Types.IDbFile[]) => Types.IFile[]) => CancellableListener;
export type ICategoriesListener = (callback: (hasError: boolean, data?: Types.ICategory[]) => void) => CancellableListener;

export const listenToCatalogues: ICatalogueListener = (callback, normaliser) => listenToDb('/catalogues', callback, normaliser);
export const listenToCategories: ICategoriesListener = (callback) => listenToDb('/folders', callback);
