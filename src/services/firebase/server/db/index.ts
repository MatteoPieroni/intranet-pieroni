import { unstable_cache } from 'next/cache';

import {
  IDbImage,
  IDbLinks,
  type IConfig,
  type IDbConfig,
  type IDbTv,
  type IGoogleAuth,
  type IImage,
  type ILink,
  type IQuote,
  type ITv,
} from '../../db-types';
import { normaliseObjectKeysToArray } from '@/utils/normaliseObjectKeysToArray';
import { type PassedHeaders } from '../serverApp';
import { create, get, remove, update } from './operations';
import { getUser } from '../auth';

const SHORT_CACHE = 60 * 60; // one hour
const LONG_CACHE = 60 * 60 * 24 * 7; // one week

export const getConfigWithoutCache = async (headers: PassedHeaders) => {
  try {
    const data = await get<IDbConfig>(headers, 'config/current');

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
};

export const getConfig = unstable_cache(getConfigWithoutCache, ['config'], {
  revalidate: SHORT_CACHE,
  tags: ['config'],
});

export const getLinksWithoutCache = async (headers: PassedHeaders) => {
  try {
    const records = await get<IDbLinks>(headers, 'links');

    const data: ILink[] = normaliseObjectKeysToArray(records);

    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getLinks = unstable_cache(getLinksWithoutCache, ['links'], {
  revalidate: LONG_CACHE,
  tags: ['links'],
});

export const getQuote = unstable_cache(
  async (headers: PassedHeaders) => {
    try {
      const record = await get<IQuote>(headers, 'quote/active');

      return record;
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
  ['quote'],
  { revalidate: LONG_CACHE, tags: ['quote'] }
);

export const getQuoteWithImages = async (headers: PassedHeaders) => {
  try {
    const quote = await getQuote(headers);

    const records = await get<IDbImage>(headers, 'images');

    const images: IImage[] = normaliseObjectKeysToArray(records);

    return {
      quote,
      images,
    };
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getTvText = async (headers: PassedHeaders) => {
  try {
    const record = await get<ITv>(headers, 'tv/active');

    return record;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getGoogleAuth = async (headers: PassedHeaders) => {
  try {
    const record = await get<IGoogleAuth | undefined>(
      headers,
      'googleAuth/active'
    );

    return record;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const pushQuote = async (headers: PassedHeaders, data: IQuote) => {
  try {
    await update(headers, 'quote/active', data);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const pushTv = async (headers: PassedHeaders, data: IDbTv) => {
  try {
    await update(headers, 'tv/active', data);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const pushLink = async (headers: PassedHeaders, data: ILink) => {
  try {
    await update(headers, `links/${data.id}`, data);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const pushConfig = async (
  headers: PassedHeaders,
  data: Partial<IDbConfig>
) => {
  try {
    const user = await getUser(headers);

    if (
      !user.currentUser?.isAdmin &&
      !Object.values(user.currentUser?.scopes?.config || {}).some(Boolean)
    ) {
      throw new Error(`Missing permissions for ${user.currentUser?.email}`);
    }

    await update(headers, `config/current`, data);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const pushGoogleAuth = async (
  headers: PassedHeaders,
  data: IGoogleAuth
) => {
  try {
    await update(headers, 'googleAuth/active', data);
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
    await update(headers, `users/${user.currentUser.id}`, { theme: data });
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
    await create(headers, 'links', data);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const deleteLink = async (
  headers: PassedHeaders,
  data: Pick<ILink, 'id'>
) => {
  try {
    await remove(headers, 'links', data.id);
  } catch (e) {
    throw e;
  }
};
