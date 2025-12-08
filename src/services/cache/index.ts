import { cacheLife, cacheTag, unstable_cache, updateTag } from 'next/cache';

const SHORT_CACHE = 60 * 60; // one hour
const LONG_CACHE = 60 * 60 * 24 * 7; // one week

const cacheTags = {
  teams: 'teams',
  users: 'users',
  issues: 'issues',
  issuesArchive: 'issues-archive',
  issuesAnalytics: 'issues-analytics',
} as const;

type Tags = (keyof typeof cacheTags)[];

const cacheDuration = {
  short: SHORT_CACHE,
  long: LONG_CACHE,
} as const;

export const withCache =
  <T extends (...args: any[]) => ReturnType<T>>(
    fn: T,
    tags: Tags,
    duration: 'short' | 'long'
  ) =>
  async (...args: Parameters<T>) => {
    // 'use cache';
    // cacheTag(...tags);
    // cacheLife({ expire: cacheDuration[duration] });

    return fn(...args);
  };

const connectedDataCaches = {
  teams: ['teams', 'users'],
  users: ['users'],
  issues: ['issues-archive'],
} as const satisfies {
  [key: string]: (typeof cacheTags)[keyof typeof cacheTags][];
};

export const bustCache = (tags: keyof typeof connectedDataCaches) => {
  const connectedTags = connectedDataCaches[tags];

  for (const tag of connectedTags) {
    updateTag(tag);
  }
};
