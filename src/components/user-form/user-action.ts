'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { FORM_FAIL_USER, FORM_SUCCESS_USER } from '@/consts';
import { pushUser } from '@/services/firebase/server';
import { User } from '@/services/firebase/db-types';
import { UserSchema } from '@/services/firebase/validator';

export type StateValidation = {
  error?: string;
  success?: string;
};

export const userAction = async (
  userData: Omit<User, 'permissions' | 'teams' | 'theme'>,
  _: StateValidation,
  values: FormData
) => {
  const currentHeaders = await headers();

  try {
    const formTeams = values.getAll('teams');
    const formPermissions = values.getAll('permissions');

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
    const permissions = formPermissions.map((permission) => String(permission));

    const verifiedData = UserSchema.parse({
      ...userData,
      permissions,
      teams,
    });

    await pushUser(currentHeaders, verifiedData);

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
