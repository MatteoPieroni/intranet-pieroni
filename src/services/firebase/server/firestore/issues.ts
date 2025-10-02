import { IIssue, IDbIssue, IIssueAction, IDbIssueAction } from '../../db-types';
import {
  IssueActionSchema,
  IssueResultSchema,
  IssueSchema,
} from '../../validator';
import { PassedHeaders } from '../serverApp';
import { create, getRecords, update, get } from './operations';
import { getUser } from '../auth';
import { Timestamp } from 'firebase/firestore';
import {
  convertTimestampToDate,
  convertTimestampToDateAction,
} from '../../utils/dto-issues';

export const getIssues = async (headers: PassedHeaders) => {
  try {
    const records = await getRecords<IIssue>(
      headers,
      'issues',
      (issue) => {
        const convertToDate = convertTimestampToDate(issue);

        const record = IssueSchema.parse(convertToDate);

        return record;
      },
      {
        orderData: { field: 'date', direction: 'desc' },
      }
    );

    return records;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getIssuesForUser = async (
  headers: PassedHeaders,
  userId: string
) => {
  try {
    const records = await getRecords<IIssue>(
      headers,
      'issues',
      (issue) => {
        const convertToDate = convertTimestampToDate(issue);

        const record = IssueSchema.parse(convertToDate);

        return record;
      },
      {
        queryData: { field: 'meta.author', value: userId },
        orderData: { field: 'date', direction: 'desc' },
      }
    );

    return records;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getIssue = async (headers: PassedHeaders, id: string) => {
  try {
    const records = await get<IIssue>(headers, ['issues', id], (issue) => {
      const convertToDate = convertTimestampToDate(issue);

      const record = IssueSchema.parse(convertToDate);

      return record;
    });

    return records;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const createEmptyIssue = async (headers: PassedHeaders) => {
  try {
    const user = await getUser(headers);

    if (!user.currentUser?.id) {
      throw new Error('Missing user id');
    }

    const now = Timestamp.now();

    const createdDoc = await create(headers, 'issues', {
      date: now,
      timeline: [],
      meta: {
        author: user.currentUser.id,
        createdAt: now,
      },
      verification: {
        isVerified: false,
      },
    });
    return createdDoc.id;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const updateIssue = async (
  headers: PassedHeaders,
  data: Omit<IIssue, 'meta' | 'verification' | 'date' | 'timeline' | 'result'>
) => {
  try {
    const {
      // result: resultWithDate,
      supplierInfo: supplierWithDate,
      ...verifiedData
    } = IssueSchema.omit({
      meta: true,
      verification: true,
      date: true,
      timeline: true,
      result: true,
    }).parse(data);

    const { documentDate, ...supplierInfoRest } = supplierWithDate || {};
    const supplierInfo = supplierWithDate
      ? {
          supplierInfo: {
            ...supplierInfoRest,
            ...(documentDate instanceof Date && {
              documentDate: Timestamp.fromDate(documentDate),
            }),
          },
        }
      : {};

    await update<IDbIssue>(headers, ['issues', verifiedData.id], {
      ...verifiedData,
      ...supplierInfo,
    });

    return { id: verifiedData.id };
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getIssueTimeline = async (headers: PassedHeaders, id: string) => {
  try {
    const records = await getRecords<IIssueAction>(
      headers,
      ['issues', id, 'timeline'],
      (issue) => {
        const convertToDate = convertTimestampToDateAction(issue);

        const record = IssueActionSchema.parse(convertToDate);

        return record;
      },
      {
        orderData: {
          field: 'date',
          direction: 'asc',
        },
      }
    );

    return records;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const addActionToIssue = async (
  headers: PassedHeaders,
  data: {
    issueId: string;
    action: Omit<IIssueAction, 'id'>;
  }
) => {
  try {
    const { date, ...verifiedData } = IssueActionSchema.omit({
      id: true,
    }).parse(data.action);

    const createdDoc = await create<Omit<IDbIssueAction, 'id'>>(
      headers,
      `issues/${data.issueId}/timeline`,
      { ...verifiedData, date: Timestamp.fromDate(date) }
    );
    await update<IDbIssueAction>(
      headers,
      ['issues', data.issueId, 'timeline', createdDoc.id],
      {
        id: createdDoc.id,
      }
    );

    return createdDoc.id;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const editIssueAction = async (
  headers: PassedHeaders,
  data: {
    issueId: string;
    action: IIssueAction;
  }
) => {
  try {
    const { date, ...verifiedData } = IssueActionSchema.parse(data.action);

    await update<IDbIssueAction>(
      headers,
      ['issues', data.issueId, 'timeline', verifiedData.id],
      {
        date: Timestamp.fromDate(date),
        ...verifiedData,
      }
    );
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const addResultToIssue = async (
  headers: PassedHeaders,
  data: {
    id: string;
    summary: string;
  }
) => {
  try {
    const user = await getUser(headers);

    if (!user.currentUser?.id) {
      throw new Error('Missing user id');
    }

    const { summary } = IssueResultSchema.omit({
      date: true,
    }).parse({ summary: data.summary });

    const now = Timestamp.now();

    await update<IDbIssue>(headers, ['issues', data.id], {
      result: {
        summary,
        date: now,
      },
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const checkIssue = async (
  headers: PassedHeaders,
  data: {
    id: string;
    isChecked: boolean;
  }
) => {
  try {
    const user = await getUser(headers);

    if (!user.currentUser?.id) {
      throw new Error('Missing user id');
    }

    const now = Timestamp.now();

    const verification = data.isChecked
      ? {
          isVerified: data.isChecked,
          verifiedAt: now,
          verifyAuthor: user.currentUser.id,
        }
      : ({
          isVerified: false,
        } as const);

    await update<Pick<IIssue, 'verification'>>(headers, ['issues', data.id], {
      verification,
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
};
