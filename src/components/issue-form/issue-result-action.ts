'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { FORM_FAIL_RISCOSSO, FORM_SUCCESS_RISCOSSO } from '@/consts';
import { addResultToIssue } from '@/services/firebase/server';
import { IssueResultSchema } from '@/services/firebase/validator';
// import { uploadIssueAttachment } from '@/services/firebase/server/storage';
// import z from 'zod';

export type StateValidation = {
  error?: string;
  success?: string;
};

const FormFieldsSchema = IssueResultSchema.omit({ date: true });

export const issueResultAction = async (
  _: StateValidation,
  values: FormData
) => {
  const authHeader = (await headers()).get('Authorization');

  try {
    const formId = values.get('id');

    if (!formId) {
      return {
        error: FORM_FAIL_RISCOSSO,
      };
    }

    const { summary } = FormFieldsSchema.parse({
      summary: values.get('summary'),
    });

    const id = String(formId);

    await addResultToIssue(authHeader, {
      id,
      summary,
    });

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
