import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import type { Metadata } from 'next';

import { getUser } from '@/services/firebase/server';
import { SignInForm } from '@/components/signin-form/signin-form';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Entra nella intranet - Pieroni srl',
  description: 'Intranet - esegui il login',
};

export default async function SignInPage() {
  const currentHeaders = await headers();
  const { currentUser } = await getUser(currentHeaders);

  if (currentUser) {
    return redirect('/');
  }

  return (
    <main>
      <div className={styles.page}>
        <h1 className={styles.title}>Entra nella intranet Pieroni</h1>
        <SignInForm />
      </div>
    </main>
  );
}
