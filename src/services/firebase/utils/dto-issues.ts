import { DocumentData } from 'firebase/firestore';

export const convertTimestampToDate = (riscosso: DocumentData) => {
  const {
    date,
    meta: { createdAt, ...meta },
    verification: { verifiedAt, ...verification },
    supplierInfo,
    result,
    updatedAt,
    ...rest
  } = riscosso;

  return {
    ...rest,
    date: new Date(date.seconds * 1000),
    ...(supplierInfo
      ? {
          supplierInfo: {
            ...supplierInfo,
            ...(supplierInfo.documentDate
              ? {
                  documentDate: new Date(
                    supplierInfo.documentDate.seconds * 1000
                  ),
                }
              : {}),
          },
        }
      : {}),
    ...(result
      ? {
          result: {
            ...result,
            ...(result.date
              ? {
                  date: new Date(result.date.seconds * 1000),
                }
              : {}),
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
    updatedAt: new Date(updatedAt.seconds * 1000),
  };
};

export const convertTimestampToDateAction = (action: DocumentData) => {
  const { date, ...rest } = action;
  return {
    date: new Date(date.seconds * 1000),
    ...rest,
  };
};
