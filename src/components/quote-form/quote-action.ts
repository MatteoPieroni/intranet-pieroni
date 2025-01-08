'use server';

import { headers } from 'next/headers';
import { revalidatePath, revalidateTag } from 'next/cache';

import {
  ERROR_EMPTY_FIELD,
  ERROR_CAPS_LOCK,
  FORM_FAIL_TV,
  FORM_SUCCESS_TV,
} from '@/consts';
import { pushQuote } from '@/services/firebase/server';
import { validateCapsLock } from '@/utils/validateCapsLock';

export type StateValidation = {
  success?: string;
  error?: string;
};

export const quoteAction = async (_: StateValidation, values: FormData) => {
  const currentHeaders = await headers();

  try {
    const formMessage = values.get('message');
    const formImage = values.get('image');

    if (!formMessage || !formImage) {
      return {
        error: ERROR_EMPTY_FIELD,
      };
    }

    const message = String(formMessage);
    const image = String(formImage);

    const isValidMessage = validateCapsLock(message);

    if (!isValidMessage) {
      return {
        error: ERROR_CAPS_LOCK,
      };
    }

    await pushQuote(currentHeaders, { text: message, url: image });

    revalidatePath('/admin');
    revalidateTag('quote');

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
