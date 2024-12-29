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

export interface ITv {
  text: string;
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
  transport_cost_per_minute: number;
  transport_cost_minimum: number;
  transport_hour_base: number;
}
export type IConfig = {
  smsApi: string;
  mailUrl: string;
  apiUrl: string;
  transportCostPerMinute: number;
  transportCostMinimum: number;
  transportHourBase: number;
};

export enum EColor {
  grey = 'grey',
  deepOrange = 'deepOrange',
  amber = 'amber',
  green = 'green',
  teal = 'teal',
  lightBlue = 'lightBlue',
  indigo = 'indigo',
  red = 'red',
  test = 'test',
}

export interface IDbFile {
  categories_id: string[];
  filename: string;
  id: string;
  label: string;
  store_url: string;
  created_at: number;
  created_by: string;
  dimension: number;
}

export interface IFile {
  categoriesId: string[] | undefined;
  filename: string;
  id: string;
  label: string;
  storeUrl: string;
  createdAt: Date;
  createdBy: string;
  dimension: number;
}

export interface IFileChanges {
  label: string;
  categoriesId: string[];
}

export type INewFile = {
  files: File[];
  categoriesId?: string[];
  label?: string;
};

export type IApiFile = {
  label?: string;
  categories?: string[];
  pdf_catalogues: [];
};

export interface ICategory {
  id: string;
  label: string;
  parent?: string;
  depth: number;
}
