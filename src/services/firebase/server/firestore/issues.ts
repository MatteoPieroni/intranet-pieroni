import { Issue, DbIssue, IssueAction, DbIssueAction } from '../../db-types';
import {
  IssueActionSchema,
  IssueResultSchema,
  IssueSchema,
} from '../../validator';
import { PassedHeaders } from '../serverApp';
import { create, getRecords, update, get, getRecordsCount } from './operations';
import { getUser } from '../auth';
import { Timestamp } from 'firebase/firestore';
import {
  convertTimestampToDate,
  convertTimestampToDateAction,
} from '../../utils/dto-issues';
import { FirebaseError } from 'firebase/app';

export const getIssues = async (headers: PassedHeaders) => {
  try {
    const records = await getRecords<Issue>(
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
    const records = await getRecords<Issue>(
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
    const records = await get<Issue>(headers, ['issues', id], (issue) => {
      const convertToDate = convertTimestampToDate(issue);

      const record = IssueSchema.parse(convertToDate);

      return record;
    });

    return records;
  } catch (e) {
    if (!(e instanceof Error) || !(e instanceof FirebaseError)) {
      console.error(e);
      throw e;
    }

    if (e instanceof FirebaseError) {
      if (e.code === 'permission-denied') {
        return { errorCode: 403 };
      }
    }

    if (e.message !== '404') {
      console.error(e);
      throw e;
    }

    // if we get 404 error because record does not exist we check the archive
    try {
      const record = await get<Issue>(
        headers,
        ['issues-archive', id],
        (issue) => {
          const convertToDate = convertTimestampToDate(issue);

          const record = IssueSchema.parse(convertToDate);

          return record;
        }
      );

      return { ...record, isArchive: true };
    } catch (e) {
      if (!(e instanceof Error) || e.message !== '404') {
        console.error(e);
        throw e;
      }

      // if we get 404 error because record does not exist we show not found
      return {
        errorCode: 404,
      };
    }
  }
};

type CreatedDbIssue = Pick<
  DbIssue,
  // IMPORTANT: we rely on client to send out emails
  'client' | 'date' | 'timeline' | 'meta' | 'verification'
>;

export const createEmptyIssue = async (
  headers: PassedHeaders,
  data: Pick<Issue, 'client'>
) => {
  try {
    const user = await getUser(headers);

    if (!user.currentUser?.id) {
      throw new Error('Missing user id');
    }

    const now = Timestamp.now();

    const createdDoc = await create<CreatedDbIssue>(headers, 'issues', {
      client: data.client,
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
  data: Omit<Issue, 'meta' | 'verification' | 'date' | 'timeline' | 'result'>
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

    await update<DbIssue>(headers, ['issues', verifiedData.id], {
      ...verifiedData,
      ...supplierInfo,
      updatedAt: Timestamp.now(),
    });

    return { id: verifiedData.id };
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getIssueTimeline = async (
  headers: PassedHeaders,
  id: string,
  isArchive = false
) => {
  try {
    const records = await getRecords<IssueAction>(
      headers,
      [!isArchive ? 'issues' : 'issues-archive', id, 'timeline'],
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

const addUpdateDate = async (headers: PassedHeaders, issueId: string) =>
  await update<Pick<DbIssue, 'updatedAt'>>(headers, ['issues', issueId], {
    updatedAt: Timestamp.now(),
  });

export const addActionToIssue = async (
  headers: PassedHeaders,
  data: {
    issueId: string;
    action: Omit<IssueAction, 'id'>;
  }
) => {
  try {
    const { date, ...verifiedData } = IssueActionSchema.omit({
      id: true,
    }).parse(data.action);

    const createdDoc = await create<Omit<DbIssueAction, 'id'>>(
      headers,
      `issues/${data.issueId}/timeline`,
      { ...verifiedData, date: Timestamp.fromDate(date) }
    );
    await update<DbIssueAction>(
      headers,
      ['issues', data.issueId, 'timeline', createdDoc.id],
      {
        id: createdDoc.id,
      }
    );

    // update timestamp
    await addUpdateDate(headers, data.issueId);

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
    action: IssueAction;
  }
) => {
  try {
    const { date, ...verifiedData } = IssueActionSchema.parse(data.action);

    await update<DbIssueAction>(
      headers,
      ['issues', data.issueId, 'timeline', verifiedData.id],
      {
        date: Timestamp.fromDate(date),
        ...verifiedData,
      }
    );

    // update timestamp
    await addUpdateDate(headers, data.issueId);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const editAttachmentsIssue = async (
  headers: PassedHeaders,
  data: {
    issueId: string;
    actionId: string;
    attachments: string[];
  }
) => {
  try {
    if (data.attachments.some((attachment) => !attachment)) {
      throw new Error('Something wrong with attachments');
    }

    await update<DbIssueAction>(
      headers,
      ['issues', data.issueId, 'timeline', data.actionId],
      {
        attachments: data.attachments,
      }
    );

    // update timestamp
    await addUpdateDate(headers, data.issueId);
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
    const { summary } = IssueResultSchema.omit({
      date: true,
    }).parse({ summary: data.summary });

    const now = Timestamp.now();

    await update<Pick<DbIssue, 'result' | 'updatedAt'>>(
      headers,
      ['issues', data.id],
      {
        result: {
          summary,
          date: now,
        },
        updatedAt: Timestamp.now(),
      }
    );
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

    await update<Pick<DbIssue, 'verification' | 'updatedAt'>>(
      headers,
      ['issues', data.id],
      {
        verification,
        updatedAt: Timestamp.now(),
      }
    );
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getIssueAnalytics = async (headers: PassedHeaders) => {
  try {
    const total = await getRecordsCount(headers, 'issues');

    const resolved = await getRecordsCount(headers, 'issues', {
      queryData: {
        field: 'result.summary',
        value: '',
        operator: '!=',
      },
    });
    const nonResolved = total - resolved;

    const nonVerified = await getRecordsCount(headers, 'issues', {
      queryData: {
        field: 'verification.isVerified',
        value: false,
      },
    });

    return { total, nonResolved, nonVerified };
  } catch (e) {
    console.error(e);
    throw e;
  }
};
