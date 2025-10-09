import { Firestore } from 'firebase-admin/firestore';

type EntityTypes = 'issues' | 'riscossi';
type ActionTypes = 'created' | 'updated';

const entityTypeToPermissionMap = {
  issues: 'write/issues',
  riscossi: 'write/riscossi',
} as const;
const entityTypeToCollectionMap = {
  issues: 'issues',
  riscossi: 'riscossi',
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
  update: {
    entityType: EntityTypes;
    id: string;
    actionType: ActionTypes;
  }
) => {
  await db
    .doc(`users/${userId}`)
    .collection('updates')
    .add({
      // timestamp
      entity: {
        id: update.id,
        entityType: entityTypeToCollectionMap[update.entityType],
        actionType: update.actionType,
      },
    });
};
