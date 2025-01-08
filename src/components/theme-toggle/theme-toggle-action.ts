'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { pushTheme } from '@/services/firebase/server';

export const themeToggleAction = async (values: FormData) => {
  const currentHeaders = await headers();

  try {
    const formValue = values.get('theme');

    if (!formValue) {
      return;
    }

    const value = String(formValue) === 'system' ? null : String(formValue);

    if (value !== 'light' && value !== 'dark' && value !== null) {
      return;
    }

    await pushTheme(currentHeaders, value);

    revalidatePath('/');
  } catch (e) {
    console.error(e);
  }
};
