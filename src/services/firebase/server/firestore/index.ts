import * as z from 'zod';
import { IDbUser, ITeam, IUser } from '../../db-types';
import { TeamSchema, UserSchema } from '../../validator';
import { PassedHeaders } from '../serverApp';
import { getRecords, update } from './operations';

export const getUsers = async (headers: PassedHeaders) => {
  try {
    const records = await getRecords<IUser>(headers, 'users', (dbUser) => {
      const record = UserSchema.extend({
        id: z.string(),
      }).parse(dbUser);
      const { cognome, nome, ...rest } = record;
      return {
        name: nome,
        surname: cognome,
        ...rest,
      };
    });

    return records;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const pushUser = async (headers: PassedHeaders, data: IUser) => {
  try {
    const { name, surname, id, ...rest } = data;
    const verifiedData = UserSchema.parse({
      nome: name,
      cognome: surname,
      ...rest,
    });

    await update<IDbUser>(headers, ['users', id], verifiedData);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getTeams = async (headers: PassedHeaders) => {
  try {
    const records = await getRecords<ITeam>(headers, 'teams', (dbTeam) => {
      const record = TeamSchema.extend({
        id: z.string(),
      }).parse(dbTeam);

      return record;
    });

    return records;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
