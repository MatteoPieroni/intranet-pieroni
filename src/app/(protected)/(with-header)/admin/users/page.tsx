import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

import styles from '../page.module.css';
import template from '../../header-template.module.css';
import { UserForm } from '@/components/user-form/user-form';
import {
  cachedGetTeams,
  cachedGetUser,
  cachedGetUsers,
} from '@/services/firebase/server';
import { TeamForm } from '@/components/team-form/team-form';
import { checkIsAdmin } from '@/services/firebase/server/permissions';

export const metadata: Metadata = {
  title: 'Admin utenti - Intranet Pieroni srl',
  description: 'Intranet - gestisci le impostazioni utenti',
};

export default async function Admin() {
  const authHeader = (await headers()).get('Authorization');
  const { currentUser } = await cachedGetUser(authHeader);

  const isAdmin = checkIsAdmin(currentUser?.permissions);

  if (!isAdmin) {
    return redirect('/');
  }

  const [users, teams] = await Promise.all([
    cachedGetUsers(authHeader),
    cachedGetTeams(authHeader),
  ]);

  return (
    <main className={template.page}>
      <div className={template.header}>
        <h1>Gestisci gli utenti</h1>
      </div>

      <div className={styles.container}>
        <div className={styles.section}>
          <h2>Team</h2>
          <div className={styles.linksContainer}>
            {teams.map((team) => (
              <TeamForm key={team.id} team={team} />
            ))}
            <TeamForm
              team={{
                name: '',
                id: '',
              }}
              isNew
            />
          </div>
        </div>

        <div className={styles.section}>
          <h2>Utenti</h2>
          <div className={styles.linksContainer}>
            {users.map((user) => (
              <UserForm user={user} key={user.id} availableTeams={teams} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
