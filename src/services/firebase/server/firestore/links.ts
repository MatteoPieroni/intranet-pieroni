import { IDbLink, ILink } from '../../db-types';
import { LinkSchema } from '../../validator';
import { PassedHeaders } from '../serverApp';
import {
  create,
  getRecords,
  update,
  remove,
  getRecordsWhereArrayToArray,
} from './operations';

export const getLinksWithoutCache = async (headers: PassedHeaders) => {
  try {
    const records = await getRecords<ILink>(headers, 'links', (dbTeam) => {
      const record = LinkSchema.parse(dbTeam);

      return record;
    });

    return records;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getLinksForTeam = async (
  headers: PassedHeaders,
  teams: string[]
) => {
  try {
    const records = await getRecordsWhereArrayToArray<ILink>(
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

export const pushLink = async (headers: PassedHeaders, data: IDbLink) => {
  try {
    const verifiedData = LinkSchema.parse(data);

    await update<IDbLink>(headers, ['links', data.id], verifiedData);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const createLink = async (
  headers: PassedHeaders,
  data: Omit<ILink, 'id'>
) => {
  try {
    const verifiedData = LinkSchema.omit({ id: true }).parse(data);

    const createdDoc = await create<Omit<ILink, 'id'>>(
      headers,
      'links',
      verifiedData
    );
    await update<IDbLink>(headers, ['links', createdDoc.id], {
      id: createdDoc.id,
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const deleteLink = async (headers: PassedHeaders, id: string) => {
  try {
    await remove(headers, 'links', id);
  } catch (e) {
    console.error(e);
    throw e;
  }
};
