'use server';

import { headers } from 'next/headers';
import { revalidatePath, revalidateTag } from 'next/cache';

import { FORM_FAIL_LINK, FORM_SUCCESS_LINK } from '@/consts';
import { pushUser } from '@/services/firebase/server';
import { IUser } from '@/services/firebase/db-types';

export type StateValidation = {
  error?: string;
  success?: string;
};

export const userAction = async (
  userData: IUser,
  _: StateValidation,
  values: FormData
) => {
  const currentHeaders = await headers();

  try {
    const formTeams = values.getAll('teams');

    if (!formTeams) {
      return {
        error: FORM_FAIL_LINK,
      };
    }

    if (!userData.id) {
      return {
        errors: {
          general: FORM_FAIL_LINK,
        },
      };
    }

    const teams = formTeams.map((team) => String(team));

    await pushUser(currentHeaders, {
      ...userData,
      teams,
    });

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
