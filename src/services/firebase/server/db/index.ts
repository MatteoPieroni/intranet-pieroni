import { unstable_cache } from 'next/cache';

import {
  DbImage,
  type Config,
  type DbConfig,
  type DbTv,
  type GoogleAuth,
  type Image,
  type Quote,
  type Tv,
} from '../../db-types';
import { normaliseObjectKeysToArray } from '@/utils/normaliseObjectKeysToArray';
import { type PassedAuth } from '../serverApp';
import { get, update } from './operations';
import { getUser } from '../auth';
import { checkCanEditConfig } from '../permissions';

const SHORT_CACHE = 60 * 60; // one hour
const LONG_CACHE = 60 * 60 * 24 * 7; // one week

export const getConfigWithoutCache = async (headers: PassedAuth) => {
  try {
    const data = await get<DbConfig>(headers, 'config/current');

    return {
      mailUrl: data.mail_url,
      transportCostPerMinute: data.transport_cost_per_minute,
      transportCostMinimum: data.transport_cost_minimum,
      transportHourBase: data.transport_hour_base,
      emailRiscossi: data.emailRiscossi,
    } satisfies Config;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getConfig = unstable_cache(getConfigWithoutCache, ['config'], {
  revalidate: SHORT_CACHE,
  tags: ['config'],
});

export const getQuote = unstable_cache(
  async (headers: PassedAuth) => {
    try {
      const record = await get<Quote>(headers, 'quote/active');

      return record;
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
  ['quote'],
  { revalidate: LONG_CACHE, tags: ['quote'] }
);

export const getQuoteWithImages = async (headers: PassedAuth) => {
  try {
    const quote = await getQuote(headers);

    const records = await get<DbImage>(headers, 'images');

    const images: Image[] = normaliseObjectKeysToArray(records);

    return {
      quote,
      images,
    };
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getTvText = async (headers: PassedAuth) => {
  try {
    const record = await get<Tv>(headers, 'tv/active');

    return record;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getGoogleAuth = async (headers: PassedAuth) => {
  try {
    const record = await get<GoogleAuth | undefined>(
      headers,
      'googleAuth/active'
    );

    return record;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const pushQuote = async (headers: PassedAuth, data: Quote) => {
  try {
    await update(headers, 'quote/active', data);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const pushTv = async (headers: PassedAuth, data: DbTv) => {
  try {
    await update(headers, 'tv/active', data);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const pushConfig = async (
  headers: PassedAuth,
  data: Partial<DbConfig>
) => {
  try {
    const user = await getUser(headers);

    if (!checkCanEditConfig(user.currentUser?.permissions)) {
      throw new Error(`Missing permissions for ${user.currentUser?.email}`);
    }

    await update(headers, `config/current`, data);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const pushGoogleAuth = async (headers: PassedAuth, data: GoogleAuth) => {
  try {
    await update(headers, 'googleAuth/active', data);
  } catch (e) {
    console.error(e);
    throw e;
  }
};
