const SHORT_CACHE = 60 * 60; // one hour
const LONG_CACHE = 60 * 60 * 24 * 7; // one week

export const collectionCacheTags = {
  teams: 'teams',
  users: 'users',
  issues: 'issues',
  issuesArchive: 'issues-archive',
  issuesAnalytics: 'issues-analytics',
  riscossi: 'riscossi',
  riscossiArchive: 'riscossi-archive',
  riscossiAnalytics: 'riscossi-analytics',
  links: 'links',
} as const;

export const cacheDuration = {
  short: { expire: SHORT_CACHE },
  long: { expire: LONG_CACHE },
} as const;

export type IssueCacheTag = `issue-${string}`;
export type RiscossoCacheTag = `riscosso-${string}`;
export type CollectionCacheTag = keyof typeof collectionCacheTags;

const entities = {
  team: 'team',
  user: 'user',
  issue: 'issue',
  riscosso: 'riscosso',
};

export type Entity = keyof typeof entities;

type EntityCache = {
  [key in Entity]?: (typeof collectionCacheTags)[keyof typeof collectionCacheTags][];
};
type Operations = 'patch' | 'create' | 'delete';

export const connectedDataCaches = {
  patch: {
    // patch name
    team: ['teams'],
    // patch team assignment
    user: ['users'],
    // patch content, patch confirmation state
    issue: ['issues', 'issues-archive', 'issues-analytics'],
    // patch content, patch confirmation state
    riscosso: ['riscossi', 'riscossi-archive', 'riscossi-analytics'],
  },
  create: {
    team: ['teams'],
    issue: ['issues', 'issues-analytics'],
    riscosso: ['riscossi', 'riscossi-analytics'],
  },
  delete: {
    // remove team from entities that reference it
    team: ['teams', 'users', 'links'],
  },
} as const satisfies {
  [key in Operations]: EntityCache;
};

export type AllowedCachesForBusting =
  | ['patch', keyof (typeof connectedDataCaches)['patch']]
  | ['patch', keyof (typeof connectedDataCaches)['patch'], string]
  | ['create', keyof (typeof connectedDataCaches)['create']]
  | ['create', keyof (typeof connectedDataCaches)['create'], string]
  | ['delete', keyof (typeof connectedDataCaches)['delete']]
  | ['delete', keyof (typeof connectedDataCaches)['delete'], string];
