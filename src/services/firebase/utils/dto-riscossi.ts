import { DocumentData, Timestamp } from 'firebase/firestore';

export const convertTimestampToDate = (riscosso: DocumentData) => {
  const {
    date,
    meta: { createdAt, ...meta },
    verification: { verifiedAt, ...verification },
    docs,
    ...rest
  } = riscosso;

  return {
    ...rest,
    date: new Date(date.seconds * 1000),
    docs: docs.map((doc: { date: Timestamp }) => ({
      ...doc,
      date: new Date(doc.date.seconds * 1000),
    })),
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
