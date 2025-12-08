import { updateTag } from 'next/cache';
import { connectedDataCaches } from './consts';

export const withCache =
  <T extends (...args: any[]) => ReturnType<T>>(
    fn: T,
    tags: string[],
    duration: 'short' | 'long'
  ) =>
  async (...args: Parameters<T>) => {
    // 'use cache';
    // cacheTag(...tags);
    // cacheLife({ expire: cacheDuration[duration] });

    return fn(...args);
  };

export const bustCache = (tags: keyof typeof connectedDataCaches) => {
  const connectedTags = connectedDataCaches[tags];

  for (const tag of connectedTags) {
    updateTag(tag);
  }
};
