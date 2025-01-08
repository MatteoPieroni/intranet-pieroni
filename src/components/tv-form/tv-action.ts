'use server';

import { headers } from 'next/headers';

import {
  ERROR_EMPTY_FIELD,
  ERROR_CAPS_LOCK,
  FORM_FAIL_TV,
  FORM_SUCCESS_TV,
} from '@/consts';
import { pushTv } from '@/services/firebase/server';
import { validateCapsLock } from '@/utils/validateCapsLock';
import { revalidatePath } from 'next/cache';

export type StateValidation = {
  success?: string;
  error?: string;
};

export const tvAction = async (_: StateValidation, values: FormData) => {
  const currentHeaders = await headers();

  try {
    const formMessage = values.get('message');

    if (!formMessage) {
      return {
        error: ERROR_EMPTY_FIELD,
      };
    }

    const message = String(formMessage);

    const isValidMessage = validateCapsLock(message);

    if (!isValidMessage) {
      return {
        error: ERROR_CAPS_LOCK,
      };
    }

    await pushTv(currentHeaders, { text: message });

    revalidatePath('/admin');

    return {
      success: FORM_SUCCESS_TV,
    };
  } catch (e) {
    console.error(e);
    return {
      errors: {
        general: FORM_FAIL_TV,
      },
    };
  }
};
