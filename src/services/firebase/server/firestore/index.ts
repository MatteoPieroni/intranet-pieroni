import * as z from 'zod';
import {
  ICleanDbLink,
  ICleanLink,
  IDbTeam,
  IDbUser,
  ITeam,
  IUser,
} from '../../db-types';
import { LinkSchema, TeamSchema, UserSchema } from '../../validator';
import { PassedHeaders } from '../serverApp';
import { create, getRecords, update, remove } from './operations';
import { getUser } from '../auth';

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

export const pushTheme = async (
  headers: PassedHeaders,
  data: 'light' | 'dark' | null
) => {
  const user = await getUser(headers);

  console.log({ user });

  if (!user.currentUser?.id) {
    throw new Error('Missing user id');
  }

  try {
    await update<Pick<IUser, 'theme'>>(
      headers,
      `users/${user.currentUser.id}`,
      { theme: data }
    );
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

export const pushTeam = async (headers: PassedHeaders, data: ITeam) => {
  try {
    const { id, ...teamData } = data;
    const verifiedData = TeamSchema.parse(teamData);

    await update<IDbTeam>(headers, ['teams', id], verifiedData);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const createTeam = async (headers: PassedHeaders, data: IDbTeam) => {
  try {
    const verifiedData = TeamSchema.parse(data);

    await create<IDbTeam>(headers, 'teams', verifiedData);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const deleteTeam = async (headers: PassedHeaders, id: string) => {
  try {
    await remove(headers, 'teams', id);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getLinks = async (headers: PassedHeaders) => {
  try {
    const records = await getRecords<ICleanLink>(headers, 'links', (dbTeam) => {
      const record = LinkSchema.parse(dbTeam);

      return record;
    });

    return records;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const pushLink = async (headers: PassedHeaders, data: ICleanDbLink) => {
  try {
    const verifiedData = LinkSchema.parse(data);

    await update<ICleanDbLink>(headers, ['links', data.id], verifiedData);
  } catch (e) {
    console.error(e);
    throw e;
  }
};
