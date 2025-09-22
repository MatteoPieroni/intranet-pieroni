import * as z from 'zod';

import {
  IDbLink,
  ILink,
  IDbTeam,
  IDbUser,
  ITeam,
  IUser,
  IRiscosso,
  IDbRiscosso,
} from '../../db-types';
import {
  LinkSchema,
  RiscossoSchema,
  TeamSchema,
  UserSchema,
} from '../../validator';
import { PassedHeaders } from '../serverApp';
import {
  create,
  getRecords,
  update,
  remove,
  getRecordsWhereArrayToArray,
  get,
} from './operations';
import { getUser } from '../auth';
import { Timestamp } from 'firebase/firestore';
import { convertTimestampToDate } from '../../utils/dto-riscossi';

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

export const getLinksWithoutCache = async (headers: PassedHeaders) => {
  try {
    const records = await getRecords<ILink>(headers, 'links', (dbTeam) => {
      const record = LinkSchema.parse(dbTeam);

      return record;
    });

    return records;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getLinksForTeam = async (
  headers: PassedHeaders,
  teams: string[]
) => {
  try {
    const records = await getRecordsWhereArrayToArray<ILink>(
      headers,
      'links',
      {
        field: 'teams',
        array: teams,
      },
      (dbTeam) => {
        const record = LinkSchema.parse(dbTeam);

        return record;
      }
    );

    return records;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const pushLink = async (headers: PassedHeaders, data: IDbLink) => {
  try {
    const verifiedData = LinkSchema.parse(data);

    await update<IDbLink>(headers, ['links', data.id], verifiedData);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const createLink = async (
  headers: PassedHeaders,
  data: Omit<ILink, 'id'>
) => {
  try {
    const verifiedData = LinkSchema.omit({ id: true }).parse(data);

    const createdDoc = await create<Omit<ILink, 'id'>>(
      headers,
      'links',
      verifiedData
    );
    await update<IDbLink>(headers, ['links', createdDoc.id], {
      id: createdDoc.id,
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const deleteLink = async (headers: PassedHeaders, id: string) => {
  try {
    await remove(headers, 'links', id);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getRiscossi = async (headers: PassedHeaders) => {
  try {
    const records = await getRecords<IRiscosso>(
      headers,
      'riscossi',
      (riscosso) => {
        const convertToDate = convertTimestampToDate(riscosso);

        const record = RiscossoSchema.parse(convertToDate);

        return record;
      },
      {
        orderData: { field: 'date', direction: 'desc' },
      }
    );

    return records;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getRiscossiForUser = async (
  headers: PassedHeaders,
  userId: string
) => {
  try {
    const records = await getRecords<IRiscosso>(
      headers,
      'riscossi',
      (riscosso) => {
        const convertToDate = convertTimestampToDate(riscosso);

        const record = RiscossoSchema.parse(convertToDate);

        return record;
      },
      {
        queryData: { field: 'meta.author', value: userId },
        orderData: { field: 'date', direction: 'desc' },
      }
    );

    return records;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getRiscosso = async (headers: PassedHeaders, id: string) => {
  try {
    const records = await get<IRiscosso>(
      headers,
      ['riscossi', id],
      (riscosso) => {
        const convertToDate = convertTimestampToDate(riscosso);

        const record = RiscossoSchema.parse(convertToDate);

        return record;
      }
    );

    return records;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const createRiscosso = async (
  headers: PassedHeaders,
  data: Omit<IRiscosso, 'id' | 'meta' | 'verification' | 'date'>
) => {
  try {
    const user = await getUser(headers);

    if (!user.currentUser?.id) {
      throw new Error('Missing user id');
    }

    const verifiedData = RiscossoSchema.omit({
      id: true,
      meta: true,
      verification: true,
      date: true,
      docs: true,
    }).parse(data);

    const now = Timestamp.now();

    const docs = data.docs.map((doc) => ({
      ...doc,
      date: Timestamp.fromDate(doc.date),
    }));

    const createdDoc = await create<Omit<IDbRiscosso, 'id'>>(
      headers,
      'riscossi',
      {
        ...verifiedData,
        date: now,
        docs,
        meta: {
          author: user.currentUser.id,
          createdAt: now,
        },
        verification: {
          isVerified: false,
        },
      }
    );
    await update<IDbRiscosso>(headers, ['riscossi', createdDoc.id], {
      id: createdDoc.id,
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const checkRiscosso = async (
  headers: PassedHeaders,
  data: {
    id: string;
    isChecked: boolean;
  }
) => {
  try {
    const user = await getUser(headers);

    if (!user.currentUser?.id) {
      throw new Error('Missing user id');
    }

    const now = Timestamp.now();

    const verification = data.isChecked
      ? {
          isVerified: data.isChecked,
          verifiedAt: now,
          verifyAuthor: user.currentUser.id,
        }
      : ({
          isVerified: false,
        } as const);

    await update<Pick<IDbRiscosso, 'verification'>>(
      headers,
      ['riscossi', data.id],
      {
        verification,
      }
    );
  } catch (e) {
    console.error(e);
    throw e;
  }
};
