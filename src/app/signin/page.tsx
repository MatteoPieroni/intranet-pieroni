import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import type { Metadata } from 'next';

import { getUser, USER_ACTIVATION_ERROR } from '@/services/firebase/server';
import { SignInForm } from '@/components/signin-form/signin-form';
import styles from './page.module.css';
import { FORM_FAIL_LOGIN_USER_TO_BE_ADDED } from '@/consts';

export const metadata: Metadata = {
  title: 'Entra nella intranet - Pieroni srl',
  description: 'Intranet - esegui il login',
};

export default async function SignInPage() {
  const authHeader = (await headers()).get('Authorization');
  const { currentUser, error } = await getUser(authHeader);

  if (currentUser) {
    return redirect('/');
  }

  const userToBeActivated =
    error?.code === USER_ACTIVATION_ERROR
      ? `${FORM_FAIL_LOGIN_USER_TO_BE_ADDED}. Copia e invia questi dati; email: ${error.email}, uid: ${error.uid}`
      : undefined;

  return (
    <main>
      <div className={styles.page}>
        <h1 className={styles.title}>Entra nella intranet Pieroni</h1>
        <SignInForm userError={userToBeActivated} />
      </div>
    </main>
  );
}
