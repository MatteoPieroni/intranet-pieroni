'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { pushTheme } from '@/services/firebase/server';

export const themeToggleAction = async (values: FormData) => {
  const authHeader = (await headers()).get('Authorization');

  try {
    const formValue = values.get('theme');

    if (!formValue) {
      return;
    }

    const value = String(formValue) === 'system' ? null : String(formValue);

    if (value !== 'light' && value !== 'dark' && value !== null) {
      return;
    }

    await pushTheme(authHeader, value);

    revalidatePath('/');
  } catch (e) {
    console.error(e);
  }
};
