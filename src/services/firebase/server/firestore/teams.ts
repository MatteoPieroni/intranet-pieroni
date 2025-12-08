import * as z from 'zod';

import { DbTeam, Team } from '../../db-types';
import { TeamSchema } from '../../validator';
import { PassedAuth } from '../serverApp';
import { create, getRecords, update, remove } from './operations';

export const getTeams = async (headers: PassedAuth) => {
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

export const pushTeam = async (headers: PassedAuth, data: Team) => {
  try {
    const { id, ...teamData } = data;
    const verifiedData = TeamSchema.parse(teamData);

    await update<DbTeam>(headers, ['teams', id], verifiedData);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const createTeam = async (headers: PassedAuth, data: DbTeam) => {
  try {
    const verifiedData = TeamSchema.parse(data);

    await create<DbTeam>(headers, 'teams', verifiedData);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const deleteTeam = async (headers: PassedAuth, id: string) => {
  try {
    await remove(headers, 'teams', id);
  } catch (e) {
    console.error(e);
    throw e;
  }
};
