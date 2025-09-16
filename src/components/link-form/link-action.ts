'use server';

import { headers } from 'next/headers';
import { revalidatePath, revalidateTag } from 'next/cache';

import { FORM_FAIL_LINK, FORM_SUCCESS_LINK } from '@/consts';
import { createLink, deleteLink, pushLink } from '@/services/firebase/server';

export type StateValidation = {
  error?: string;
  success?: string;
};

export const linkAction = async (_: StateValidation, values: FormData) => {
  const currentHeaders = await headers();

  try {
    const formDescription = values.get('description');
    const formLink = values.get('link');
    const formId = values.get('id');
    const formIsNew = values.get('isNew');
    const formTeams = values.getAll('teams');

    if (!formDescription || !formLink || !formTeams) {
      return {
        error: FORM_FAIL_LINK,
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
    const teams = formTeams.map((team) => String(team));

    if (isNew && !id) {
      await createLink(currentHeaders, {
        description,
        link,
        teams,
      });
    } else {
      await pushLink(currentHeaders, {
        description,
        link,
        id,
        teams,
      });
    }

    revalidatePath('/admin');
    revalidateTag('links');

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

    await deleteLink(currentHeaders, id);

    revalidatePath('/admin');
    revalidateTag('links');
  } catch (e) {
    console.error(e);
    throw e;
  }
};
