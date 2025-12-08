import * as z from 'zod';

import { DbTeam, Team } from '../../db-types';
import { TeamSchema } from '../../validator';
import { PassedHeaders } from '../serverApp';
import { create, getRecords, update, remove } from './operations';
import { withCache } from '../../../cache';

export const getTeams = async (headers: PassedHeaders) => {
  try {
    const records = await getRecords<Team>(headers, 'teams', (dbTeam) => {
      const record = TeamSchema.extend({
        id: z.string(),
      }).parse(dbTeam);

      return record;
    });

    return records;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const cachedGetTeams = withCache(getTeams, ['teams'], 'long');

export const pushTeam = async (headers: PassedHeaders, data: Team) => {
  try {
    const { id, ...teamData } = data;
    const verifiedData = TeamSchema.parse(teamData);

    await update<DbTeam>(headers, ['teams', id], verifiedData);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const createTeam = async (headers: PassedHeaders, data: DbTeam) => {
  try {
    const verifiedData = TeamSchema.parse(data);

    await create<DbTeam>(headers, 'teams', verifiedData);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const deleteTeam = async (headers: PassedHeaders, id: string) => {
  try {
    await remove(headers, 'teams', id);
  } catch (e) {
    console.error(e);
    throw e;
  }
};
