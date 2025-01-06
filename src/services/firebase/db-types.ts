export interface IDbUser {
  nome: string;
  cognome: string;
  email: string;
  isAdmin: boolean;
  scopes?: {
    gmb?: boolean;
  };
}

export interface IUser {
  id: string;
  name: string;
  surname: string;
  email: string;
  isAdmin: boolean;
  scopes?: {
    gmb?: boolean;
  };
}

export interface IDbLinks {
  [id: string]: {
    color: EColor;
    description: string;
    id: string;
    link: string;
  };
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

export interface IGoogleAuth {
  refresh_token: string;
}

export interface IImage {
  url: string;
}

export interface IDbImage {
  [id: string]: {
    url: string;
  };
}

export interface IDbTv {
  text: string;
}

export interface IStorageFile {
  path: string;
}

export interface IDbConfig {
  mail_url: string;
  transport_cost_per_minute: number;
  transport_cost_minimum: number;
  transport_hour_base: number;
}

export type IConfig = {
  mailUrl: string;
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
