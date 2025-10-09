import {
  Change,
  FirestoreEvent,
  QueryDocumentSnapshot,
} from 'firebase-functions/firestore';
import { addUpdateToUser, getAdmins } from '../services/firestore';
import { Firestore } from 'firebase-admin/firestore';
import { MailerSend } from 'mailersend';
import { sendRiscossoCreation } from '../services/email';
import { error } from 'firebase-functions/logger';

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
  const created = event.data?.data();
  const id = event.params.id;

  if (!created || !id) {
    return;
  }

  const { client, total } = created;

  if (!client || !total) {
    return;
  }

  const admins = await getAdmins(db, entityType);

  try {
    await Promise.all(
      admins.map(async (admin) => {
        await addUpdateToUser(db, admin.id, {
          id,
          entityType,
          actionType: 'created',
        });

        await sendRiscossoCreation(transporter, admin.email, {
          client,
          id,
          total,
          link: `${process.env.BASE_URL}/riscossi/${id}`,
        });
      })
    );
  } catch (e) {
    error('Error sending riscosso creation', e);
  }
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
  const id = event.params.id;

  if (!id) {
    return;
  }

  const admins = await getAdmins(db, entityType);

  try {
    await Promise.all(
      admins.map(async (admin) => {
        await addUpdateToUser(db, admin.id, {
          id,
          entityType,
          actionType: 'updated',
        });
      })
    );
  } catch (e) {
    error('Error sending riscosso update', e);
  }
};
