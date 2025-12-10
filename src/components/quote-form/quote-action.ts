'use server';

import { headers } from 'next/headers';
import { revalidatePath, revalidateTag } from 'next/cache';
import * as z from 'zod';

import { ERROR_CAPS_LOCK, FORM_FAIL_TV, FORM_SUCCESS_TV } from '@/consts';
import { pushQuote } from '@/services/firebase/server';
import { validateCapsLock } from '@/utils/validateCapsLock';

export type StateValidation = {
  success?: string;
  error?: string;
};

const FormSchema = z.object({
  message: z.string(),
  image: z.url(),
});

export const quoteAction = async (_: StateValidation, values: FormData) => {
  const authHeader = (await headers()).get('Authorization');

  try {
    const { message, image } = FormSchema.parse({
      message: values.get('message'),
      image: values.get('image'),
    });

    const isValidMessage = validateCapsLock(message);

    if (!isValidMessage) {
      return {
        error: ERROR_CAPS_LOCK,
      };
    }

    await pushQuote(authHeader, { text: message, url: image });

    revalidatePath('/admin');
    revalidateTag('quote', 'max');

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
