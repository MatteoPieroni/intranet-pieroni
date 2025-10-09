import {
  Change,
  FirestoreEvent,
  QueryDocumentSnapshot,
} from 'firebase-functions/firestore';
import { addUpdateToUser, getAdmins } from '../services/firestore';
import { Firestore } from 'firebase-admin/firestore';
import { sendIssueCreation } from '../services/email';
import { MailerSend } from 'mailersend';

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
  // const oldValue = event.data?.before.data();
  const created = event.data?.data();

  if (!created) {
    return;
  }

  const admins = await getAdmins(db, 'issues');

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

      await sendIssueCreation(transporter, admin.email, {
        client: created.client,
        id: created.id,
        link: `${process.env.BASE_URL}/issues/${created.id}`,
      });
    })
  );
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

  await Promise.all(
    admins.map(async (admin) => {
      await addUpdateToUser(db, admin.id, {
        id: id,
        entityType,
        actionType: 'updated',
      });
    })
  );
};
