import { Firestore, Timestamp } from 'firebase-admin/firestore';

type EntityTypes = 'issues' | 'riscossi';
type ActionTypes = 'created' | 'updated';

type DbUpdate = {
  id: string;
  entityType: 'issues' | 'riscossi';
  actionType: ActionTypes;
};

const entityTypeToPermissionMap = {
  issues: 'write/issues',
  riscossi: 'write/riscossi',
} as const;
const entityTypeToCollectionMap = {
  issues: 'issues',
  riscossi: 'riscossi',
} as const;
const entityTypeToArchiveCollectionMap = {
  issues: 'issues-archive',
  riscossi: 'riscossi-archive',
} as const;

export const getAdmins = async (db: Firestore, entityType: EntityTypes) => {
  const adminType = entityTypeToPermissionMap[entityType];

  const adminsSnapshot = await db
    .collection('users')
    .where('permissions', 'array-contains', adminType)
    .get();

  const admins: {
    email: string;
    id: string;
  }[] = [];

  adminsSnapshot.forEach((admin) => {
    admins.push({
      email: admin.data()['email'],
      id: admin.id,
    });
  });

  return admins;
};

export const addUpdateToUser = async (
  db: Firestore,
  userId: string,
  update: Omit<DbUpdate, 'timestamp'>
) => {
  const dbEntityType = entityTypeToCollectionMap[update.entityType];

  const pendingUpdatesForIssue = await db
    .doc(`users/${userId}`)
    .collection('updates')
    .where('entityType', '==', dbEntityType)
    .where('entityId', '==', update.id)
    .count()
    .get();

  if (pendingUpdatesForIssue.data().count > 0) {
    return;
  }

  await db.doc(`users/${userId}`).collection('updates').add({
    timestamp: Timestamp.now(),
    actionType: update.actionType,
    entityId: update.id,
    entityType: dbEntityType,
  });
};

export const moveToArchive = async (
  db: Firestore,
  entityType: 'issues' | 'riscossi',
  entityId: string
) => {
  const dbEntityType = entityTypeToCollectionMap[entityType];
  const dbEntityArchiveType = entityTypeToArchiveCollectionMap[entityType];

  const originalDataRef = db.doc(`${dbEntityType}/${entityId}`);
  const originalData = (await originalDataRef.get()).data();

  if (!originalData) {
    return;
  }

  await db.collection(dbEntityArchiveType).doc(entityId).set(originalData);

  // issues have a subcollection that we need to replicate
  if (entityType === 'issues') {
    const originalActionsSnapshot = await originalDataRef
      .collection('timeline')
      .get();

    for (const action of originalActionsSnapshot.docs) {
      const actionData = action.data();

      await db
        .collection(dbEntityArchiveType)
        .doc(entityId)
        .collection('timeline')
        .doc(action.id)
        .set(actionData);
    }
  }

  await db.recursiveDelete(originalDataRef);
};
