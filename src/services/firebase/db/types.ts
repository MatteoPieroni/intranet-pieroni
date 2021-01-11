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
