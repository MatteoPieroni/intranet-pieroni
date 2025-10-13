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
import { MailerSend } from 'mailersend';
import { sendRiscossoCreation } from '../services/email';
import { error } from 'firebase-functions/logger';
import { sendRiscossoChecked } from '../services/email/riscossi';

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
  transporter: MailerSend,
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
  // if not after and before this is an action creation event
  // so we don't need to handle "checking" the original document
  if (event.data && 'after' in event?.data && 'before' in event?.data) {
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
      await moveToArchive(db, 'riscossi', id);

      if (!authorEmail) {
        return;
      }

      // send email to creator
      try {
        await sendRiscossoChecked(transporter, authorEmail, {
          client,
          id,
          confirmerEmail,
        });
      } catch (e) {
        error('Could not send email', `riscossi/${id}`, e);
      }

      return;
    }
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
