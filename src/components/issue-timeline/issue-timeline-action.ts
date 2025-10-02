'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { FORM_FAIL_RISCOSSO, FORM_SUCCESS_RISCOSSO } from '@/consts';
import { addActionToIssue } from '@/services/firebase/server';
import { IssueActionSchema } from '@/services/firebase/validator';
// import { uploadIssueAttachment } from '@/services/firebase/server/storage';
// import z from 'zod';

export type StateValidation = {
  error?: string;
  success?: string;
};

const FormFieldsSchema = IssueActionSchema.omit({
  id: true,
  attachments: true,
});

export const issueAction = async (
  issueId: string,
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

    // const formActionAttachment = values.getAll('action-attachment');

    // const timeline = await handleTimeline(
    //   formActionDate,
    //   formActionNumber,
    //   formActionResult,
    //   formActionAttachment
    // );

    const verifiedAction = FormFieldsSchema.parse({
      date: new Date(String(values.get('date'))),
      content: values.get('content'),
      result: values.get('result'),
    });

    let id = String(formId);
    const isNew = String(formIsNew) === 'NEW';

    // TODO: attachments

    if (isNew && !id) {
      id = await addActionToIssue(currentHeaders, {
        issueId,
        action: verifiedAction,
      });
    } else {
      // TODO: update
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
