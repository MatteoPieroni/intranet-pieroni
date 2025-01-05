'use server';

import { headers } from 'next/headers';

import {
  ERROR_EMPTY_FIELD,
  ERROR_INVALID_MESSAGE,
  FORM_FAIL_TV,
  FORM_SUCCESS_TV,
} from '@/consts';
import { pushQuoteOnServer } from '@/services/firebase/server';
import { validateCapsLock } from '@/utils/validateCapsLock';
import { revalidatePath } from 'next/cache';

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
        error: ERROR_INVALID_MESSAGE,
      };
    }

    await pushQuoteOnServer(currentHeaders, { text: message, url: image });

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
