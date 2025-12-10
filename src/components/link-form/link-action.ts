'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';

import { FORM_FAIL_LINK, FORM_SUCCESS_LINK } from '@/consts';
import { createLink, deleteLink, pushLink } from '@/services/firebase/server';
import { uploadLinkIcon } from '@/services/firebase/server/storage';

export type StateValidation = {
  error?: string;
  success?: string;
};

const FormSchema = z.object({
  description: z.string(),
  link: z.url(),
  icon: z.optional(z.file()),
  teams: z.array(z.string()),
});

export const linkAction = async (_: StateValidation, values: FormData) => {
  const authHeader = (await headers()).get('Authorization');

  try {
    const formId = values.get('id');
    const formIsNew = values.get('isNew');

    if (!formId && !formIsNew) {
      return {
        errors: {
          general: FORM_FAIL_LINK,
        },
      };
    }

    const { description, link, teams, icon } = FormSchema.parse({
      description: values.get('description'),
      link: values.get('link'),
      icon: values.get('icon'),
      teams: values.getAll('teams'),
    });

    const id = String(formId);
    const isNew = String(formIsNew) === 'NEW';

    let iconUpload: string | undefined = undefined;

    if (icon && icon.size > 0) {
      const uploadFileUrl = await uploadLinkIcon(authHeader, icon);
      iconUpload = uploadFileUrl;
    }

    if (isNew && !id) {
      await createLink(authHeader, {
        description,
        link,
        teams,
        ...(iconUpload ? { icon: iconUpload } : {}),
      });
    } else {
      await pushLink(authHeader, {
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
      error: FORM_FAIL_LINK,
    };
  }
};

export const linkDeleteAction = async (id: string) => {
  const authHeader = (await headers()).get('Authorization');

  try {
    if (!id) {
      throw new Error('No id provided');
    }

    await deleteLink(authHeader, id);

    revalidatePath('/admin');
  } catch (e) {
    console.error(e);
    throw e;
  }
};
