'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { ERROR_EMPTY_FIELD, FORM_FAIL_LINK, FORM_SUCCESS_LINK } from '@/consts';
import {
  createLinkOnServer,
  deleteLinkOnServer,
  pushLinkOnServer,
} from '@/services/firebase/server';
import { EColor } from '@/services/firebase/db-types';

export type StateValidation = {
  errors?: {
    link?: string;
    description?: string;
    general?: string;
  };
  success?: string;
};

export const linkAction = async (_: StateValidation, values: FormData) => {
  const currentHeaders = await headers();

  try {
    const formDescription = values.get('description');
    const formLink = values.get('link');
    const formId = values.get('id');
    const formIsNew = values.get('isNew');

    if (!formDescription || !formLink) {
      return {
        errors: {
          description: !formDescription ? ERROR_EMPTY_FIELD : undefined,
          link: !formLink ? ERROR_EMPTY_FIELD : undefined,
        },
      };
    }

    if (!formId && !formIsNew) {
      return {
        errors: {
          general: FORM_FAIL_LINK,
        },
      };
    }

    const description = String(formDescription);
    const link = String(formLink);
    const id = String(formId);
    const isNew = String(formIsNew) === 'NEW';

    if (isNew && !id) {
      await createLinkOnServer(currentHeaders, {
        description,
        link,
        color: EColor.amber,
      });
    } else {
      await pushLinkOnServer(currentHeaders, {
        description,
        link,
        id,
        color: EColor.amber,
      });
    }

    revalidatePath('/admin');

    return {
      success: FORM_SUCCESS_LINK,
    };
  } catch (e) {
    console.error(e);
    return {
      errors: {
        general: FORM_FAIL_LINK,
      },
    };
  }
};

export const linkDeleteAction = async (id: string) => {
  const currentHeaders = await headers();

  try {
    if (!id) {
      throw new Error('No id provided');
    }

    await deleteLinkOnServer(currentHeaders, {
      id,
    });

    revalidatePath('/admin');
  } catch (e) {
    console.error(e);
    throw e;
  }
};
