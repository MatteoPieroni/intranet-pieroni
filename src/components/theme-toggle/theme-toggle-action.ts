'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { pushThemeOnServer } from '@/services/firebase/server';

export const themeToggleAction = async (values: FormData) => {
  const currentHeaders = await headers();

  try {
    const formValue = values.get('theme');
    console.log({ formValue });

    if (!formValue) {
      return;
    }

    const value = String(formValue) === 'system' ? null : String(formValue);

    if (value !== 'light' && value !== 'dark' && value !== null) {
      return;
    }

    await pushThemeOnServer(currentHeaders, value);

    revalidatePath('/');
  } catch (e) {
    console.error(e);
  }
};
