import { unstable_cache, updateTag } from 'next/cache';

const SHORT_CACHE = 60 * 60; // one hour
const LONG_CACHE = 60 * 60 * 24 * 7; // one week

const cacheTags = {
  teams: 'teams',
  users: 'users',
} as const;

type Tags = (typeof cacheTags)[keyof typeof cacheTags][];

const cacheDuration = {
  short: SHORT_CACHE,
  long: LONG_CACHE,
} as const;

export const withCache = <T extends Parameters<typeof unstable_cache>[0]>(
  fn: T,
  tags: Tags,
  duration: 'short' | 'long'
) => unstable_cache(fn, tags, { revalidate: cacheDuration[duration], tags });

const connectedDataCaches = {
  teams: ['teams', 'users'],
  users: ['users'],
} as const satisfies {
  [key in keyof typeof cacheTags]: (typeof cacheTags)[keyof typeof cacheTags][];
};

export const bustCache = (tags: keyof typeof connectedDataCaches) => {
  const connectedTags = connectedDataCaches[tags];

  for (const tag of connectedTags) {
    updateTag(tag);
  }
};
