const SHORT_CACHE = 60 * 60; // one hour
const LONG_CACHE = 60 * 60 * 24 * 7; // one week

export const cacheTags = {
  teams: 'teams',
  users: 'users',
  issues: 'issues',
  issuesArchive: 'issues-archive',
  issuesAnalytics: 'issues-analytics',
} as const;

export const cacheDuration = {
  short: { expire: SHORT_CACHE },
  long: { expire: LONG_CACHE },
} as const;

export const connectedDataCaches = {
  teams: ['teams', 'users'],
  users: ['users'],
  issues: ['issues-archive'],
} as const satisfies {
  [key: string]: (typeof cacheTags)[keyof typeof cacheTags][];
};
