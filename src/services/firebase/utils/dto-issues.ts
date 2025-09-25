import { DocumentData, Timestamp } from 'firebase/firestore';

export const convertTimestampToDate = (riscosso: DocumentData) => {
  const {
    date,
    meta: { createdAt, ...meta },
    verification: { verifiedAt, ...verification },
    timeline,
    supplierInfo,
    result,
    ...rest
  } = riscosso;

  return {
    ...rest,
    date: new Date(date.seconds * 1000),
    timeline: timeline.map((action: { date: Timestamp }) => ({
      ...action,
      date: new Date(action.date.seconds * 1000),
    })),
    ...(supplierInfo
      ? {
          supplierInfo: {
            ...supplierInfo,
            documentDate: new Date(supplierInfo.documentDate.seconds * 1000),
          },
        }
      : {}),
    ...(result
      ? {
          result: {
            ...result,
            date: new Date(result.date.seconds * 1000),
          },
        }
      : {}),
    meta: {
      ...meta,
      createdAt: new Date(createdAt.seconds * 1000),
    },
    verification: {
      ...verification,
      ...(verifiedAt
        ? { verifiedAt: new Date(verifiedAt.seconds * 1000) }
        : {}),
    },
  };
};
