import { DbUser, User, UserUpdate } from '../../db-types';
import { UserSchema, UserUpdateSchema } from '../../validator';
import { PassedHeaders } from '../serverApp';
import { getRecords, getRecordsCount, update } from './operations';
import { getUser } from '../auth';

export const getUsers = async (headers: PassedHeaders) => {
  try {
    const records = await getRecords<User>(headers, 'users', (dbUser) => {
      const record = UserSchema.parse(dbUser);

      return record;
    });

    return records;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const pushUser = async (headers: PassedHeaders, data: User) => {
  try {
    const { id, ...rest } = data;
    const verifiedData = UserSchema.parse({
      id,
      ...rest,
    });

    await update<DbUser>(headers, ['users', id], verifiedData);
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
    await update<Pick<User, 'theme'>>(headers, `users/${user.currentUser.id}`, {
      theme: data,
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getUserUpdates = async (
  headers: PassedHeaders,
  userId: string,
  type: 'issues'
) => {
  try {
    const records = await getRecords<UserUpdate>(
      headers,
      ['users', userId, 'updates'],
      (update) => {
        const { timestamp, ...rest } = update;
        const date = new Date(timestamp.seconds * 1000);

        const record = UserUpdateSchema.parse({
          timestamp: date,
          ...rest,
        });

        return record;
      },
      {
        queryData: { field: 'entityType', value: type },
      }
    );

    return records;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
export const getUserUpdatesCount = async (
  headers: PassedHeaders,
  userId: string,
  type: 'issues' | 'riscossi'
) => {
  try {
    const count = await getRecordsCount(headers, ['users', userId, 'updates'], {
      queryData: { field: 'entityType', value: type },
    });

    return count;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const removeUpdate = async (headers: PassedHeaders, data: User) => {
  try {
    const { id, ...rest } = data;
    const verifiedData = UserSchema.parse({
      id,
      ...rest,
    });

    await update<DbUser>(headers, ['users', id], verifiedData);
  } catch (e) {
    console.error(e);
    throw e;
  }
};
