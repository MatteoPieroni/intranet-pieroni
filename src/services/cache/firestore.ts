import { cacheLife, cacheTag } from 'next/cache';
import { getUsers } from '../firebase/server';
import { cacheTags } from './consts';

type CachedCall<T extends (...args: any[]) => Promise<any>> = T;

export const cachedGetUsers: CachedCall<typeof getUsers> = async (...args) => {
  'use cache';
  cacheTag(cacheTags.users);
  cacheLife({ expire: 3000 });

  return getUsers(...args);
};
