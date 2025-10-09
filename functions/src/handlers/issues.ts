import {
  Change,
  FirestoreEvent,
  QueryDocumentSnapshot,
} from 'firebase-functions/firestore';
import { addUpdateToUser, getAdmins } from '../services/firestore';
import { Firestore } from 'firebase-admin/firestore';
import { sendIssueCreation } from '../services/email';
import { MailerSend } from 'mailersend';
import { error } from 'firebase-functions/logger';

const entityType = 'issues';

export const handleIssueCreation = async (
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
  const id = event.data?.id;

  if (!created || !id) {
    return;
  }

  const { client } = created;

  if (!client) {
    return;
  }

  const admins = await getAdmins(db, 'issues');

  try {
    await Promise.all(
      admins.map(async (admin) => {
        await addUpdateToUser(db, admin.id, {
          id,
          entityType,
          actionType: 'created',
        });

        await sendIssueCreation(transporter, admin.email, {
          client,
          id,
          link: `${process.env.BASE_URL}/issues/${id}`,
        });
      })
    );
  } catch (e) {
    error('Error sending issue creation', e);
  }
};

export const handleIssueUpdate = async (
  db: Firestore,
  event:
    | FirestoreEvent<
        QueryDocumentSnapshot | undefined,
        {
          id: string;
        }
      >
    | FirestoreEvent<Change<QueryDocumentSnapshot | undefined> | undefined>
) => {
  if (!event.data) {
    return;
  }

  const id = 'data' in event.data ? event.data?.id : event.data.after?.id;

  if (!id) {
    return;
  }

  const admins = await getAdmins(db, 'issues');

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
    error('Error sending issue update', e);
  }
};
