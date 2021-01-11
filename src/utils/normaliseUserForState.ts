import { IDbUser, IUser } from '../services/firebase/db';

export const normaliseUserForState: (id: string, user: IDbUser) => IUser =
  (id, { nome: name, cognome: surname, ...rest }) => ({
    id,
    name,
    surname,
    ...rest,
  });
