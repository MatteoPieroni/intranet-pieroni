// auth
export type Subscriber = (user: firebase.User | null) => void;
export interface ILogin {
  email: string;
  password: string;
}

// db
export type GetUser = (id: string) => Promise<any>;

// objects
export interface IUser {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}
