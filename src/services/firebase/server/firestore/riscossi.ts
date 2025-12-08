import { Riscosso, DbRiscosso } from '../../db-types';
import { RiscossoSchema } from '../../validator';
import { PassedAuth } from '../serverApp';
import { create, getRecords, update, get, getRecordsCount } from './operations';
import { getUser } from '../auth';
import { Timestamp } from 'firebase/firestore';
import { convertTimestampToDate } from '../../utils/dto-riscossi';
import { FirebaseError } from 'firebase/app';

// long cache
export const getRiscossi = async (headers: PassedAuth) => {
  try {
    const records = await getRecords<Riscosso>(
      headers,
      'riscossi',
      (riscosso) => {
        const convertToDate = convertTimestampToDate(riscosso);

        const record = RiscossoSchema.parse(convertToDate);

        return record;
      },
      {
        orderData: { field: 'updatedAt', direction: 'desc' },
      }
    );

    return records;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

// long cache
export const getRiscossiFromArchive = async (headers: PassedAuth) => {
  try {
    const records = await getRecords<Riscosso>(
      headers,
      'riscossi-archive',
      (riscosso) => {
        const convertToDate = convertTimestampToDate(riscosso);

        const record = RiscossoSchema.parse(convertToDate);

        return record;
      },
      {
        orderData: { field: 'updatedAt', direction: 'desc' },
        limit: 20,
      }
    );

    return records;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getRiscossiForUser = async (
  headers: PassedAuth,
  userId: string
) => {
  try {
    const records = await getRecords<Riscosso>(
      headers,
      'riscossi',
      (riscosso) => {
        const convertToDate = convertTimestampToDate(riscosso);

        const record = RiscossoSchema.parse(convertToDate);

        return record;
      },
      {
        queryData: { field: 'meta.author', value: userId },
        orderData: { field: 'updatedAt', direction: 'desc' },
      }
    );

    return records;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

// long cache
export const getRiscosso = async (headers: PassedAuth, id: string) => {
  try {
    const records = await get<Riscosso>(
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
    if (!(e instanceof Error) && !(e instanceof FirebaseError)) {
      console.error(e);
      throw e;
    }

    if (e instanceof FirebaseError) {
      if (e.code === 'permission-denied') {
        return { errorCode: 403 };
      }
    }

    if (e.message !== '404') {
      console.error(e);
      throw e;
    }

    // if we get 404 error because record does not exist we check the archive
    try {
      const record = await get<Riscosso>(
        headers,
        ['riscossi-archive', id],
        (riscosso) => {
          const convertToDate = convertTimestampToDate(riscosso);

          const record = RiscossoSchema.parse(convertToDate);

          return record;
        }
      );

      return { ...record, isArchive: true };
    } catch (e) {
      if (!(e instanceof Error) || e.message !== '404') {
        console.error(e);
        throw e;
      }

      // if we get 404 error because record does not exist we show not found
      return {
        errorCode: 404,
      };
    }
  }
};

// long cache
export const getRiscossiAnalytics = async (headers: PassedAuth) => {
  try {
    const total = await getRecordsCount(headers, 'riscossi');

    const nonVerified = await getRecordsCount(headers, 'riscossi', {
      queryData: {
        field: 'verification.isVerified',
        value: false,
      },
    });

    return { total, nonVerified };
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const createRiscosso = async (
  headers: PassedAuth,
  data: Omit<Riscosso, 'id' | 'meta' | 'verification' | 'date' | 'updatedAt'>
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
      updatedAt: true,
    }).parse(data);

    const now = Timestamp.now();

    const docs = data.docs.map((doc) => ({
      ...doc,
      date: Timestamp.fromDate(doc.date),
    }));

    const createdDoc = await create<Omit<DbRiscosso, 'id'>>(
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
        updatedAt: now,
      }
    );
    await update<DbRiscosso>(headers, ['riscossi', createdDoc.id], {
      id: createdDoc.id,
    });

    return { id: createdDoc.id };
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const updateRiscosso = async (
  headers: PassedAuth,
  data: Omit<Riscosso, 'meta' | 'verification' | 'date' | 'updatedAt'>
) => {
  try {
    const verifiedData = RiscossoSchema.omit({
      meta: true,
      verification: true,
      date: true,
      docs: true,
    }).parse(data);

    const docs = data.docs.map((doc) => ({
      ...doc,
      date: Timestamp.fromDate(doc.date),
    }));

    await update<DbRiscosso>(headers, ['riscossi', verifiedData.id], {
      ...verifiedData,
      docs,
      updatedAt: Timestamp.now(),
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const checkRiscosso = async (
  headers: PassedAuth,
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

    await update<Pick<DbRiscosso, 'verification' | 'updatedAt'>>(
      headers,
      ['riscossi', data.id],
      {
        verification,
        updatedAt: Timestamp.now(),
      }
    );
  } catch (e) {
    console.error(e);
    throw e;
  }
};
