'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { FORM_FAIL_RISCOSSO, FORM_SUCCESS_RISCOSSO } from '@/consts';
import { checkRiscosso } from '@/services/firebase/server';
import { bustCache } from '@/services/cache';

export type StateValidation = {
  error?: string;
  success?: string;
};

export const riscossoCheckAction = async (
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

    await checkRiscosso(authHeader, { id, isChecked });

    bustCache('patch', 'riscosso');
    revalidatePath('/riscossi');

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
