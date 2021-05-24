export interface IRecord<T> {
  [key: string]: T;
}

export interface IDbUser {
  nome: string;
  cognome: string;
  email: string;
  isAdmin: boolean;
}

export interface IUser {
  id: string;
  name: string;
  surname: string;
  email: string;
  isAdmin: boolean;
}

export interface ILink {
  color: EColor;
  description: string;
  id: string;
  link: string;
}

export interface IQuote {
  text: string;
  url: string;
}

export interface IImage {
  url: string;
}

export interface IDbSms {
  message: string;
  number: string;
  sender: string;
  senderUID: string;
  time: number;
}

export interface IStorageFile {
  path: string;
}

export interface IDbConfig {
  sms_api: string;
  mail_url: string;
  api_url: string;
}
export type IConfig = {
  smsApi: string;
  mailUrl: string;
  apiUrl: string;
}

export enum EColor {
  grey = 'grey',
  deepOrange = 'deepOrange',
  amber = 'amber',
  green = 'green',
  teal = 'teal',
  lightBlue = 'lightBlue',
  indigo = 'indigo',
  red = 'red',
  test = 'test'
}

export interface IDbFile {
  categories_id: string[];
  filename: string;
  id: string;
  label: string;
  store_url: string;
}

export interface IFile {
  categoriesId: string[] | undefined;
  filename: string;
  id: string;
  label: string;
  storeUrl: string;
}

export interface IFileChanges {
  label: string;
  categoriesId: string[];
}

export interface ICategory {
  id: string;
  label: string;
  parent?: string;
  depth: number;
}

