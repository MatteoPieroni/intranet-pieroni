import { updateTag } from 'next/cache';
import { AllowedCachesForBusting, connectedDataCaches, Entity } from './consts';

export const bustCache = (...args: AllowedCachesForBusting) => {
  const [operation, entity] = args;

  // this is not nice, but TS is complaining about key being in record
  const operationTags = connectedDataCaches[operation] as Record<
    string,
    string[]
  >;

  // we check the key is actually there, even though the args typing is correct
  if (!(entity in operationTags)) {
    throw new Error('Trying to bust inexistent cache');
  }

  const tags = operationTags[entity];

  for (const tag of tags) {
    updateTag(tag);
  }
};
