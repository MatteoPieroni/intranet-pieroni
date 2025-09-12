import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

import styles from '../page.module.css';
import { getUser } from '@/services/firebase/server';
import template from '../../header-template.module.css';
import { UserForm } from '@/components/user-form/user-form';
import { getTeams, getUsers } from '@/services/firebase/server/firestore';

export const metadata: Metadata = {
  title: 'Admin utenti - Intranet Pieroni srl',
  description: 'Intranet - gestisci le impostazioni utenti',
};

export default async function Admin() {
  const currentHeaders = await headers();
  const { currentUser } = await getUser(currentHeaders);

  const isAdmin = currentUser?.isAdmin;

  const [users, availableTeams] = await Promise.all([
    getUsers(currentHeaders),
    getTeams(currentHeaders),
  ]);

  if (!isAdmin) {
    return redirect('/');
  }

  return (
    <main className={template.page}>
      <div className={template.header}>
        <h1>Gestisci gli utenti</h1>
      </div>
      <div className={styles.container}>
        <>
          <div className={styles.section}>
            <h2>Utenti</h2>
            {users.map((user) => (
              <UserForm
                user={user}
                key={user.id}
                availableTeams={availableTeams}
              />
            ))}
          </div>
        </>
      </div>
    </main>
  );
}
