import { cacheLife, cacheTag } from 'next/cache';
import {
  getIssue,
  getIssueAnalytics,
  getIssues,
  getIssuesFromArchive,
  getRiscossi,
  getRiscossiAnalytics,
  getRiscossiFromArchive,
  getTeams,
  getUsers,
} from '../firebase/server';
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

export const cachedGetIssues: CachedCall<typeof getIssues> = async (
  ...args
) => {
  'use cache';
  cacheTag(cacheTags.issues);
  cacheLife(cacheDuration.long);

  return getIssues(...args);
};
export const cachedGetIssuesFromArchive: CachedCall<
  typeof getIssuesFromArchive
> = async (...args) => {
  'use cache';
  cacheTag(cacheTags.issuesArchive);
  cacheLife(cacheDuration.long);

  return getIssuesFromArchive(...args);
};
export const cachedGetIssueAnalytics: CachedCall<
  typeof getIssueAnalytics
> = async (...args) => {
  'use cache';
  cacheTag(cacheTags.issuesAnalytics);
  cacheLife(cacheDuration.long);

  return getIssueAnalytics(...args);
};

export const cachedGetRiscossi: CachedCall<typeof getRiscossi> = async (
  ...args
) => {
  'use cache';
  cacheTag(cacheTags.riscossi);
  cacheLife(cacheDuration.long);

  return getRiscossi(...args);
};
export const cachedGetRiscossiFromArchive: CachedCall<
  typeof getRiscossiFromArchive
> = async (...args) => {
  'use cache';
  cacheTag(cacheTags.riscossiArchive);
  cacheLife(cacheDuration.long);

  return getRiscossiFromArchive(...args);
};
export const cachedGetRiscossiAnalytics: CachedCall<
  typeof getRiscossiAnalytics
> = async (...args) => {
  'use cache';
  cacheTag(cacheTags.riscossiAnalytics);
  cacheLife(cacheDuration.long);

  return getRiscossiAnalytics(...args);
};
