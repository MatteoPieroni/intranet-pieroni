'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { FORM_FAIL_USER, FORM_SUCCESS_USER } from '@/consts';
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
        error: FORM_FAIL_USER,
      };
    }

    if (!userData.id) {
      return {
        errors: {
          general: FORM_FAIL_USER,
        },
      };
    }

    const teams = formTeams.map((team) => String(team));

    await pushUser(currentHeaders, {
      ...userData,
      teams,
    });

    revalidatePath('/admin/users');

    return {
      success: FORM_SUCCESS_USER,
    };
  } catch (e) {
    console.error(e);
    return {
      errors: {
        general: FORM_FAIL_USER,
      },
    };
  }
};
