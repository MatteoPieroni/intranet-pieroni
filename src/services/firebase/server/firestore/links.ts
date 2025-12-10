import { DbLink, Link } from '../../db-types';
import { LinkSchema } from '../../validator';
import { PassedAuth } from '../serverApp';
import {
  create,
  getRecords,
  update,
  remove,
  getRecordsWhereArrayToArray,
} from './operations';

export const getLinksWithoutCache = async (headers: PassedAuth) => {
  try {
    const records = await getRecords<Link>(headers, 'links', (dbTeam) => {
      const record = LinkSchema.parse(dbTeam);

      return record;
    });

    return records;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getLinksForTeam = async (headers: PassedAuth, teams: string[]) => {
  try {
    const records = await getRecordsWhereArrayToArray<Link>(
      headers,
      'links',
      {
        field: 'teams',
        array: teams,
      },
      (dbTeam) => {
        const record = LinkSchema.parse(dbTeam);

        return record;
      }
    );

    return records;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const pushLink = async (headers: PassedAuth, data: DbLink) => {
  try {
    const verifiedData = LinkSchema.parse(data);

    await update<DbLink>(headers, ['links', data.id], verifiedData);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const createLink = async (
  headers: PassedAuth,
  data: Omit<Link, 'id'>
) => {
  try {
    const verifiedData = LinkSchema.omit({ id: true }).parse(data);

    const createdDoc = await create<Omit<Link, 'id'>>(
      headers,
      'links',
      verifiedData
    );
    await update<DbLink>(headers, ['links', createdDoc.id], {
      id: createdDoc.id,
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const deleteLink = async (headers: PassedAuth, id: string) => {
  try {
    await remove(headers, 'links', id);
  } catch (e) {
    console.error(e);
    throw e;
  }
};
