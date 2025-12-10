import { cacheLife, cacheTag, updateTag } from 'next/cache';
import {
  AllowedCachesForBusting,
  cacheDuration,
  CollectionCacheTag,
  connectedDataCaches,
  IssueCacheTag,
  RiscossoCacheTag,
} from './consts';

export const setCacheTags = (
  tags: (CollectionCacheTag | IssueCacheTag | RiscossoCacheTag)[]
) => {
  cacheTag(...tags);
};

export const setCacheDuration = (duration: 'short' | 'long') => {
  cacheLife(cacheDuration[duration]);
};

export const bustCache = (...args: AllowedCachesForBusting) => {
  const [operation, entity, id] = args;

  // this is not nice, but TS is complaining about key being in record
  const operationTags = connectedDataCaches[operation] as Record<
    string,
    string[]
  >;

  // we check the key is actually there, even though the args typing is correct
  if (!(entity in operationTags)) {
    throw new Error('Trying to bust inexistent cache');
  }

  const collectionsTags = operationTags[entity];
  const entityTag = typeof id === 'string' ? [`${entity}-${id}`] : [];

  const tags = [...collectionsTags, ...entityTag];

  for (const tag of tags) {
    updateTag(tag);
  }
};
