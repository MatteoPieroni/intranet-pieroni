import { DbUser, User, UserUpdate } from '../../db-types';
import { UserSchema, UserUpdateSchema } from '../../validator';
import { PassedAuth } from '../serverApp';
import { getRecords, getRecordsCount, remove, update } from './operations';
import { getUser } from '../auth';
import { withCache } from '@/services/cache';
import { cacheLife, cacheTag } from 'next/cache';

export const getUsers = async (headers: PassedAuth) => {
  console.log('getUsers');
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

const withCacheUsers =
  (fn: (headers: PassedAuth) => ReturnType<typeof getUsers>) =>
  async (headers: PassedAuth) => {
    'use cache';
    console.log({ headers });
    cacheTag('users');
    cacheLife({ expire: 3000 });

    return await fn(headers);
  };

export const cachedGetUsers = withCacheUsers(getUsers);

export const pushUser = async (headers: PassedAuth, data: User) => {
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
  headers: PassedAuth,
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
  headers: PassedAuth,
  userId: string,
  type: 'issues' | 'riscossi'
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
  headers: PassedAuth,
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

export const removeUserUpdate = async (
  headers: PassedAuth,
  userId: string,
  data: Pick<UserUpdate, 'entityId' | 'entityType'>
) => {
  try {
    const updates = await getRecords<{ id: string }>(
      headers,
      ['users', userId, 'updates'],
      (update) => ({ id: update.id }),
      {
        queryData: [
          {
            field: 'entityType',
            value: data.entityType,
          },
          {
            field: 'entityId',
            value: data.entityId,
          },
        ],
      }
    );

    for (const update of updates) {
      await remove(headers, ['users', userId, 'updates'], update.id);
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
};
