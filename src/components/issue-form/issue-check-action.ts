'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { FORM_FAIL_RISCOSSO, FORM_SUCCESS_RISCOSSO } from '@/consts';
import { checkIssue } from '@/services/firebase/server';

export type StateValidation = {
  error?: string;
  success?: string;
};

export const issueCheckAction = async (
  _: StateValidation,
  values: FormData
) => {
  const authHeader = (await headers()).get('Authorization');

  try {
    const formId = values.get('id');
    const formIsChecked = values.get('checked');

    if (!formId) {
      return {
        error: FORM_FAIL_RISCOSSO,
      };
    }

    const id = String(formId);
    const isChecked = String(formIsChecked) === 'on';

    await checkIssue(authHeader, { id, isChecked });

    revalidatePath('/issues');

    return {
      success: FORM_SUCCESS_RISCOSSO,
    };
  } catch (e) {
    console.error(e);
    return {
      errors: {
        general: FORM_FAIL_RISCOSSO,
      },
    };
  }
};
