import {
  Change,
  FirestoreEvent,
  QueryDocumentSnapshot,
} from 'firebase-functions/firestore';
import {
  addUpdateToUser,
  getAdmins,
  getUserEmail,
  moveToArchive,
} from '../services/firestore';
import { Firestore } from 'firebase-admin/firestore';
import { sendIssueCreation } from '../services/email';
import { MailerSend } from 'mailersend';
import { error } from 'firebase-functions/logger';
import { sendIssueChecked } from '../services/email/issues';

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
  const id = event.params.id;

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
  transporter: MailerSend,
  event: FirestoreEvent<
    Change<QueryDocumentSnapshot | undefined> | undefined,
    {
      id: string;
    }
  >
) => {
  if (!event.data) {
    return;
  }

  const id = event.params.id;

  if (!id) {
    return;
  }

  const { before, after } = event.data || {};

  // check verification
  const prevVerification = before?.data()?.verification;
  const currentVerification = after?.data()?.verification;

  if (
    currentVerification?.isVerified === true &&
    prevVerification?.isVerified === false
  ) {
    const { client, meta, verification } = after?.data() || {};
    const authorEmail = await getUserEmail(db, meta.author);
    const confirmerEmail =
      (await getUserEmail(db, verification.verifyAuthor)) || 'admin';

    // move to archive
    await moveToArchive(db, 'issues', id);

    if (!authorEmail) {
      return;
    }

    // send email to creator
    try {
      await sendIssueChecked(transporter, authorEmail, {
        client,
        id,
        confirmerEmail,
      });
    } catch (e) {
      error('Could not send email', `riscossi/${id}`, e);
    }

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

export const handleIssueActionUpdate = async (
  db: Firestore,
  event:
    | FirestoreEvent<
        QueryDocumentSnapshot | undefined,
        {
          id: string;
        }
      >
    | FirestoreEvent<
        Change<QueryDocumentSnapshot | undefined> | undefined,
        {
          id: string;
        }
      >
) => {
  if (!event.data) {
    return;
  }

  const id = event.params.id;

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
