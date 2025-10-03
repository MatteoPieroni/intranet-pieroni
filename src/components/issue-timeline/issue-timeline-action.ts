'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { FORM_FAIL_RISCOSSO, FORM_SUCCESS_RISCOSSO } from '@/consts';
import {
  addActionToIssue,
  editAttachmentsIssue,
  editIssueAction,
} from '@/services/firebase/server';
import { IssueActionSchema } from '@/services/firebase/validator';
import { IIssueAction } from '@/services/firebase/db-types';
import {
  deleteIssueAttachment,
  uploadIssueAttachment,
} from '@/services/firebase/server/storage';
import { PassedHeaders } from '@/services/firebase/server/serverApp';

export type StateValidation = {
  error?: string;
  success?: string;
};

const FormFieldsSchema = IssueActionSchema.omit({
  id: true,
  attachments: true,
});

const deleteAttachments = async (
  currentHeaders: PassedHeaders,
  issueId: string,
  attachments: FormDataEntryValue[]
) => {
  const deletedAttachments = [];

  for (const attachment of attachments) {
    if (!(typeof attachment === 'string')) {
      continue;
    }

    try {
      await deleteIssueAttachment(currentHeaders, issueId, attachment);
      deletedAttachments.push(attachment);
    } catch (e) {
      // ignore error and don't push to final array, so it won't be filtered out
      console.error(e);
    }
  }

  return deletedAttachments;
};

const uploadAndAddAttachment = async (
  currentHeaders: PassedHeaders,
  issueId: string,
  attachments: FormDataEntryValue[]
) => {
  const uploadedAttachments = [];
  const failedUploads = [];

  for (const attachment of attachments) {
    if (!(attachment instanceof File)) {
      continue;
    }

    try {
      const url = await uploadIssueAttachment(
        currentHeaders,
        issueId,
        attachment
      );
      uploadedAttachments.push(url);
    } catch (e) {
      // ignore error and don't push to final array, so it won't be filtered out
      console.error(e);
      failedUploads.push(attachment.name);
    }
  }

  return { uploadedAttachments, failedUploads };
};

export const issueAction = async (
  issueId: string,
  attachments: IIssueAction['attachments'],
  _: StateValidation,
  values: FormData
) => {
  const currentHeaders = await headers();

  try {
    const formId = values.get('id');
    const formIsNew = values.get('isNew');

    if (!formId && !formIsNew) {
      return {
        error: FORM_FAIL_RISCOSSO,
      };
    }

    const verifiedAction = FormFieldsSchema.parse({
      date: new Date(String(values.get('date'))),
      content: values.get('content'),
      result: values.get('result'),
    });

    const id = String(formId);
    const isNew = String(formIsNew) === 'NEW';

    if (isNew && !id) {
      await addActionToIssue(currentHeaders, {
        issueId,
        action: verifiedAction,
      });
    } else {
      await editIssueAction(currentHeaders, {
        issueId,
        action: {
          id,
          ...verifiedAction,
        },
      });
    }

    revalidatePath('/issues');

    try {
      const formActionAttachment = values.getAll('attachment');
      const formActionAttachmentRemoval = values.getAll('attachments-removal');

      // remove files then filter array
      const deletedAttachments = await deleteAttachments(
        currentHeaders,
        issueId,
        formActionAttachmentRemoval
      );
      const attachmentsWithoutRemoved = (attachments || []).filter(
        (attachment) => !deletedAttachments.includes(attachment)
      );

      // upload file and push to array
      const { uploadedAttachments, failedUploads } =
        await uploadAndAddAttachment(
          currentHeaders,
          issueId,
          formActionAttachment
        );

      const finalAttachments = [
        ...attachmentsWithoutRemoved,
        ...uploadedAttachments,
      ];

      console.log({ finalAttachments });

      await editAttachmentsIssue(currentHeaders, {
        issueId,
        actionId: id,
        attachments: finalAttachments,
      });

      if (failedUploads.length > 0) {
        throw new Error(`Could not upload ${JSON.stringify(failedUploads)}`);
      }
    } catch (e) {
      console.error(e);
      throw new Error('ATTACHMENT_ERROR');
    }

    revalidatePath('/issues');

    return {
      success: FORM_SUCCESS_RISCOSSO,
    };
  } catch (e) {
    console.error(e);

    return {
      error: FORM_FAIL_RISCOSSO,
    };
  }
};
