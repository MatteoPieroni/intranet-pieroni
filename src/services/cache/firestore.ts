import { cacheLife, cacheTag } from 'next/cache';
import { getTeams, getUsers } from '../firebase/server';
import { cacheDuration, cacheTags } from './consts';

type CachedCall<T extends (...args: any[]) => Promise<any>> = T;

export const cachedGetUsers: CachedCall<typeof getUsers> = async (...args) => {
  'use cache';
  cacheTag(cacheTags.users);
  cacheLife(cacheDuration.short);

  return getUsers(...args);
};

export const cachedGetTeams: CachedCall<typeof getTeams> = async (...args) => {
  'use cache';
  cacheTag(cacheTags.teams);
  cacheLife(cacheDuration.long);

  return getTeams(...args);
};
