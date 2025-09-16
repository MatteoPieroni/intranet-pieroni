'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { FORM_FAIL_LINK, FORM_SUCCESS_LINK } from '@/consts';
import { createLink, deleteLink, pushLink } from '@/services/firebase/server';
import { uploadLinkIcon } from '@/services/firebase/server/storage';

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
    const formIcon = values.get('icon');
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

    const icon = formIcon instanceof File ? formIcon : undefined;
    let iconUpload: string | undefined = undefined;

    if (icon && icon.size > 0) {
      const uploadFileUrl = await uploadLinkIcon(currentHeaders, icon);
      iconUpload = uploadFileUrl;
    }

    if (isNew && !id) {
      await createLink(currentHeaders, {
        description,
        link,
        teams,
        ...(iconUpload ? { icon: iconUpload } : {}),
      });
    } else {
      await pushLink(currentHeaders, {
        description,
        link,
        id,
        teams,
        ...(iconUpload ? { icon: iconUpload } : {}),
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

    await deleteLink(currentHeaders, id);

    revalidatePath('/admin');
  } catch (e) {
    console.error(e);
    throw e;
  }
};
