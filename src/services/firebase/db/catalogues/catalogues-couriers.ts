import * as Types from '../types';
import { addRecord, CancellableListener, listenToDb, removeRecord, updateRecord } from '../db';

export type ICatalogueListener = (callback: (hasError: boolean, data?: Types.IFile[]) => void, normaliser: (data: { [key: string]: Types.IDbFile }) => Types.IFile[]) => CancellableListener;
export type ICategoriesListener = (callback: (hasError: boolean, data?: Types.ICategory[]) => void) => CancellableListener;

export const listenToCatalogues: ICatalogueListener = (callback, normaliser) => listenToDb('/catalogues', callback, normaliser);
export const listenToCategories: ICategoriesListener = (callback) => listenToDb('/catalogues-categories', callback);
export const addCategory: (data: Types.ICategory) => Promise<Types.ICategory> = async (data) => await addRecord('/catalogues-categories', data, true);
export const editCategory: (data: Types.ICategory) => Promise<Types.ICategory> = async (data) => await updateRecord('/catalogues-categories', data.id, data);
export const removeCategory: (id: string) => Promise<void> = async (id) => await removeRecord('/catalogues-categories', id);
