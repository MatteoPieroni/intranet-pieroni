import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { getUser } from '@/services/firebase/server';
import { SignInForm } from '@/components/signin-form/signin-form';
import styles from './page.module.css';

export default async function SignInPage() {
  const currentHeaders = await headers();
  const { currentUser } = await getUser(currentHeaders);

  if (currentUser) {
    redirect('/');
  }

  return (
    <main>
      <div className={styles.page}>
        <h1>Entra nella intranet Pieroni</h1>
        <SignInForm />
      </div>
    </main>
  );
}
