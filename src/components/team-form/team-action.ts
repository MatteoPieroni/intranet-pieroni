'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { FORM_FAIL_TEAM, FORM_SUCCESS_TEAM } from '@/consts';
import { createTeam, deleteTeam, pushTeam } from '@/services/firebase/server';
import { bustCache } from '@/services/cache';

export type StateValidation = {
  error?: string;
  success?: string;
};

export const teamAction = async (_: StateValidation, values: FormData) => {
  const authHeader = (await headers()).get('Authorization');

  try {
    const formName = values.get('name');
    const formId = values.get('id');
    const formIsNew = values.get('isNew');

    if (!formName) {
      return {
        error: FORM_FAIL_TEAM,
      };
    }

    if (!formId && !formIsNew) {
      return {
        errors: {
          general: FORM_FAIL_TEAM,
        },
      };
    }

    const name = String(formName);
    const id = String(formId);
    const isNew = String(formIsNew) === 'NEW';

    if (isNew && !id) {
      await createTeam(authHeader, {
        name,
      });
      bustCache('create', 'team');
    } else {
      await pushTeam(authHeader, {
        name,
        id,
      });
      bustCache('patch', 'team');
    }

    revalidatePath('/admin/users');

    return {
      success: FORM_SUCCESS_TEAM,
    };
  } catch (e) {
    console.error(e);
    return {
      errors: {
        general: FORM_FAIL_TEAM,
      },
    };
  }
};

export const teamDeleteAction = async (id: string) => {
  const authHeader = (await headers()).get('Authorization');

  try {
    if (!id) {
      throw new Error('No id provided');
    }

    await deleteTeam(authHeader, id);

    revalidatePath('/admin/users');
    bustCache('delete', 'team');
  } catch (e) {
    console.error(e);
    throw e;
  }
};
