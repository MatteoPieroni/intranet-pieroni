import { IDbUser, IUser } from '../../db-types';
import { UserSchema } from '../../validator';
import { PassedHeaders } from '../serverApp';
import { getRecords, update } from './operations';
import { getUser } from '../auth';

export const getUsers = async (headers: PassedHeaders) => {
  try {
    const records = await getRecords<IUser>(headers, 'users', (dbUser) => {
      const { nome, cognome, ...user } = dbUser;
      const record = UserSchema.parse({
        name: nome,
        surname: cognome,
        ...user,
      });

      return record;
    });

    return records;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const pushUser = async (headers: PassedHeaders, data: IUser) => {
  try {
    const { id, ...rest } = data;
    const verifiedData = UserSchema.parse({
      id,
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
