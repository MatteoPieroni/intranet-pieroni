// auth
export type Subscriber = (user: firebase.User | null) => void;
export interface ILogin {
  email: string;
  password: string;
}

// db
export type GetDbRecordById = (recordString: string, id: string) => Promise<any>;
export type GetDbRecords = (recordString: string) => Promise<ILink[] | IImage[] | ISms[] | IDbPlace[]>;
export type GetDbCollection = () => Promise<IImage[] | ISms[] | IDbPlace[]>;
export type ListenCallback = (hasError: boolean | undefined, data?: any) => void;
export type ListenToDb = (recordString: string, callback: ListenCallback) => () => void;
export type ListenToDbCollection = (callback: ListenCallback) => () => void;

// objects
export interface IDbUser {
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface ILink {
  color: string;
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

export interface ISms {
  message: string;
  number: number;
  sender: string;
  senderUID: string;
  time: number;
}

export interface IDbPlace {
  formatted_address: string;
  time: number;
  user: string;
}
