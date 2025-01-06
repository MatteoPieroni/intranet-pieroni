import { unstable_cache } from 'next/cache';
import {
  child,
  get,
  getDatabase,
  push,
  ref,
  remove,
  update,
} from 'firebase/database';

import type {
  IConfig,
  IDbConfig,
  IDbTv,
  IGoogleAuth,
  IImage,
  ILink,
  IQuote,
  ITv,
} from '../../db-types';
import { normaliseObjectKeysToArray } from '@/utils/normaliseObjectKeysToArray';
import { getApp, type PassedHeaders } from '../serverApp';

export const getConfigOnServer = unstable_cache(
  async (headers: PassedHeaders) => {
    const firebaseServerApp = await getApp(headers);
    const dbRef = ref(getDatabase(firebaseServerApp));

    try {
      const record = await get(child(dbRef, '/config'));

      if (!record.exists()) {
        throw new Error('No config found');
      }

      const data: IDbConfig = record.val();

      return {
        mailUrl: data.mail_url,
        transportCostPerMinute: data.transport_cost_per_minute,
        transportCostMinimum: data.transport_cost_minimum,
        transportHourBase: data.transport_hour_base,
      } satisfies IConfig;
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
  ['config'],
  { revalidate: 3600, tags: ['config'] }
);

export const getLinks = async (headers: PassedHeaders) => {
  const firebaseServerApp = await getApp(headers);
  const dbRef = ref(getDatabase(firebaseServerApp));

  try {
    const records = await get(child(dbRef, '/links'));

    if (!records.exists()) {
      throw new Error('Could not connect to the database');
    }

    const data: ILink[] = normaliseObjectKeysToArray(records.val());

    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getQuote = async (headers: PassedHeaders) => {
  const firebaseServerApp = await getApp(headers);
  const dbRef = ref(getDatabase(firebaseServerApp));

  try {
    const record = await get(child(dbRef, '/quote/active'));

    if (!record.exists()) {
      throw new Error('Could not connect to the database');
    }

    const data: IQuote = record.val();

    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getQuoteWithImages = async (headers: PassedHeaders) => {
  const quote = await getQuote(headers);

  const firebaseServerApp = await getApp(headers);
  const dbRef = ref(getDatabase(firebaseServerApp));

  try {
    const records = await get(child(dbRef, '/images'));

    if (!records.exists()) {
      throw new Error('Could not connect to the database');
    }

    const images: IImage[] = normaliseObjectKeysToArray(records.val());

    return {
      quote,
      images,
    };
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const pushQuoteOnServer = async (
  headers: PassedHeaders,
  data: IQuote
) => {
  const firebaseServerApp = await getApp(headers);
  const db = getDatabase(firebaseServerApp);
  const dbRef = ref(db);

  try {
    await update(child(dbRef, `quote/active`), data);
  } catch (e) {
    throw e;
  }
};

export const getTvText = async (headers: PassedHeaders) => {
  const firebaseServerApp = await getApp(headers);
  const dbRef = ref(getDatabase(firebaseServerApp));

  try {
    const record = await get(child(dbRef, '/tv/active'));

    if (!record.exists()) {
      throw new Error('Could not connect to the database');
    }

    const data: ITv = record.val();

    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const pushTvOnServer = async (headers: PassedHeaders, data: IDbTv) => {
  const firebaseServerApp = await getApp(headers);
  const db = getDatabase(firebaseServerApp);
  const dbRef = ref(db);

  try {
    await update(child(dbRef, `tv/active`), data);
  } catch (e) {
    throw e;
  }
};

export const pushLinkOnServer = async (headers: PassedHeaders, data: ILink) => {
  const firebaseServerApp = await getApp(headers);
  const db = getDatabase(firebaseServerApp);
  const dbRef = ref(db);

  try {
    await update(child(dbRef, `links/${data.id}`), data);
  } catch (e) {
    throw e;
  }
};

export const createLinkOnServer = async (
  headers: PassedHeaders,
  data: Omit<ILink, 'id'>
) => {
  const firebaseServerApp = await getApp(headers);
  const db = getDatabase(firebaseServerApp);
  const dbRef = ref(db);

  try {
    const newPostKey = push(child(dbRef, 'links')).key;

    const postData = {
      ...data,
      id: newPostKey,
    };

    await update(ref(db, `links/${newPostKey}`), postData);
  } catch (e) {
    throw e;
  }
};

export const deleteLinkOnServer = async (
  headers: PassedHeaders,
  data: Pick<ILink, 'id'>
) => {
  const firebaseServerApp = await getApp(headers);
  const db = getDatabase(firebaseServerApp);

  try {
    await remove(ref(db, `links/${data.id}`));
  } catch (e) {
    throw e;
  }
};

export const getGoogleAuth = async (headers: PassedHeaders) => {
  const firebaseServerApp = await getApp(headers);
  const dbRef = ref(getDatabase(firebaseServerApp));

  try {
    const record = await get(child(dbRef, '/googleAuth/active'));

    if (!record.exists()) {
      throw new Error('Could not connect to the database');
    }

    const data: IGoogleAuth | undefined = record.val();

    return data;
  } catch (e) {
    throw e;
  }
};

export const pushGoogleAuthOnServer = async (
  headers: PassedHeaders,
  data: IGoogleAuth
) => {
  const firebaseServerApp = await getApp(headers);
  const db = getDatabase(firebaseServerApp);
  const dbRef = ref(db);

  try {
    await update(child(dbRef, 'googleAuth/active'), data);
  } catch (e) {
    throw e;
  }
};
