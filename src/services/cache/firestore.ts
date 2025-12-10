import {
  getIssue,
  getIssueAnalytics,
  getIssues,
  getIssuesFromArchive,
  getRiscossi,
  getRiscossiAnalytics,
  getRiscossiFromArchive,
  getRiscosso,
  getTeams,
  getUsers,
} from '../firebase/server';
import { setCacheDuration, setCacheTags } from './operations';

type CachedCall<T extends (...args: any[]) => Promise<any>> = T;

export const cachedGetUsers: CachedCall<typeof getUsers> = async (...args) => {
  'use cache';
  setCacheTags(['users']);
  setCacheDuration('short');

  return getUsers(...args);
};

export const cachedGetTeams: CachedCall<typeof getTeams> = async (...args) => {
  'use cache';
  setCacheTags(['teams']);
  setCacheDuration('long');

  return getTeams(...args);
};

export const cachedGetIssues: CachedCall<typeof getIssues> = async (
  ...args
) => {
  'use cache';
  setCacheTags(['issues']);
  setCacheDuration('long');

  return getIssues(...args);
};
export const cachedGetIssuesFromArchive: CachedCall<
  typeof getIssuesFromArchive
> = async (...args) => {
  'use cache';
  setCacheTags(['issuesArchive']);
  setCacheDuration('long');

  return getIssuesFromArchive(...args);
};
export const cachedGetIssueAnalytics: CachedCall<
  typeof getIssueAnalytics
> = async (...args) => {
  'use cache';
  setCacheTags(['issuesAnalytics']);
  setCacheDuration('long');

  return getIssueAnalytics(...args);
};
export const cachedGetIssue: CachedCall<typeof getIssue> = async (...args) => {
  'use cache';
  setCacheTags([`issue-${args[1]}`]);
  setCacheDuration('long');

  return getIssue(...args);
};

export const cachedGetRiscossi: CachedCall<typeof getRiscossi> = async (
  ...args
) => {
  'use cache';
  setCacheTags(['riscossi']);
  setCacheDuration('long');

  return getRiscossi(...args);
};
export const cachedGetRiscossiFromArchive: CachedCall<
  typeof getRiscossiFromArchive
> = async (...args) => {
  'use cache';
  setCacheTags(['riscossiArchive']);
  setCacheDuration('long');

  return getRiscossiFromArchive(...args);
};
export const cachedGetRiscossiAnalytics: CachedCall<
  typeof getRiscossiAnalytics
> = async (...args) => {
  'use cache';
  setCacheTags(['riscossiAnalytics']);
  setCacheDuration('long');

  return getRiscossiAnalytics(...args);
};
export const cachedGetRiscosso: CachedCall<typeof getRiscosso> = async (
  ...args
) => {
  'use cache';
  setCacheTags([`riscosso-${args[1]}`]);
  setCacheDuration('long');

  return getRiscosso(...args);
};
