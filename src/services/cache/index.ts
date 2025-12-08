import { unstable_cache, updateTag } from 'next/cache';

const SHORT_CACHE = 60 * 60; // one hour
const LONG_CACHE = 60 * 60 * 24 * 7; // one week

const cacheTags = {
  teams: 'teams',
} as const;

type Tags = (typeof cacheTags)[keyof typeof cacheTags][];

const cacheDuration = {
  short: SHORT_CACHE,
  long: LONG_CACHE,
} as const;

export const withCache = (
  fn: Parameters<typeof unstable_cache>[0],
  tags: Tags,
  duration: 'short' | 'long'
) => unstable_cache(fn, tags, { revalidate: cacheDuration[duration], tags });

export const bustCache = (tags: Tags) => {
  for (const tag of tags) {
    updateTag(tag);
  }
};
