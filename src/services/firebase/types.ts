/* eslint-disable @typescript-eslint/no-explicit-any */
// auth
export type Subscriber = (user: firebase.User | null) => void;
export interface ILogin {
  email: string;
  password: string;
}

export enum ELoginErrors {
  noUser = 'auth/user-not-found',
  wrongEmail = 'auth/invalid-email',
}

export enum EResetErrors {
  wrongEmail = 'auth/user-not-found',
}

// db
export type GetDbRecordById = (recordString: string, id: string) => Promise<any>;
export type GetDbRecords = (recordString: string) => Promise<any>;
export type GetDbCollection = () => Promise<any>;
export type ListenCallback = (hasError: boolean | undefined, data?: any) => void;
export type ListenToDb = (recordString: string, callback: ListenCallback) => () => void;
export type ListenToDbCollection = (callback: ListenCallback) => () => void;
export type UpdateRecord = (recordString: string, id: string, data: any) => Promise<any | Error>;
export type AddRecord = (recordString: string, data: any, includeId: boolean) => Promise<any | Error>;
export type RemoveRecord = (recordString: string, id: string) => Promise<any | Error>;

// objects
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

export enum EColor {
  grey = 'grey',
  deepOrange = 'deepOrange',
  amber = 'amber',
  green = 'green',
  teal = 'teal',
  lightBlue = 'lightBlue',
  indigo = 'indigo',
  red = 'red'
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

export interface IDbPlace {
  formatted_address: string;
  time: number;
  user: string;
}

export interface IStorageFile {
  path: string;
}