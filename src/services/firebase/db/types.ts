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
export interface IRecord<T> {
  [key: string]: T;
}

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
  red = 'red',
  test = 'test'
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

export type IMail = string; 

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

export interface IDbConfig {
  sms_api: string;
  mail_url: string;
}
export type IConfig = {
  smsApi: string;
  mailUrl: string;
}