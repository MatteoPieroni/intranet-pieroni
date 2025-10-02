import { IRiscosso, IDbRiscosso } from '../../db-types';
import { RiscossoSchema } from '../../validator';
import { PassedHeaders } from '../serverApp';
import { create, getRecords, update, get } from './operations';
import { getUser } from '../auth';
import { Timestamp } from 'firebase/firestore';
import { convertTimestampToDate } from '../../utils/dto-riscossi';

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

    return { id: createdDoc.id };
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
