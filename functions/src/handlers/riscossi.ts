import {
  Change,
  FirestoreEvent,
  QueryDocumentSnapshot,
} from 'firebase-functions/firestore';
import { addUpdateToUser, getAdmins } from '../services/firestore';
import { Firestore } from 'firebase-admin/firestore';
import { MailerSend } from 'mailersend';
import { sendRiscossoCreation } from '../services/email';

const entityType = 'riscossi';

export const handleRiscossoCreation = async (
  db: Firestore,
  transporter: MailerSend,
  event: FirestoreEvent<
    QueryDocumentSnapshot | undefined,
    {
      id: string;
    }
  >
) => {
  // const oldValue = event.data?.before.data();
  const created = event.data?.data();

  if (!created) {
    return;
  }

  const admins = await getAdmins(db, 'riscossi');

  await Promise.all(
    admins.map(async (admin) => {
      if (!event.data?.id) {
        return;
      }

      await addUpdateToUser(db, admin.id, {
        id: event.data.id,
        entityType,
        actionType: 'created',
      });

      await sendRiscossoCreation(transporter, admin.email, {
        client: created.client,
        id: created.id,
        link: `${process.env.BASE_URL}/riscossi/${created.id}`,
        total: created.total,
      });
    })
  );
};

export const handleRiscossoUpdate = async (
  db: Firestore,
  event: FirestoreEvent<
    Change<QueryDocumentSnapshot | undefined> | undefined,
    {
      id: string;
    }
  >
) => {
  // const oldValue = event.data?.before.data();
  const updated = event.data?.after?.id;

  if (!updated) {
    return;
  }

  const admins = await getAdmins(db, 'riscossi');

  await Promise.all(
    admins.map(async (admin) => {
      await addUpdateToUser(db, admin.id, {
        id: updated,
        entityType,
        actionType: 'created',
      });
    })
  );
};
