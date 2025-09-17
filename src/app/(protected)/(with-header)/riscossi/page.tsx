import type { Metadata } from 'next';

import styles from './page.module.css';
import template from '../header-template.module.css';
import { getRiscossi, getUser } from '@/services/firebase/server';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: 'Riscossi - Intranet Pieroni srl',
  description: 'Intranet - vedi i riscossi',
};

export default async function Riscossi() {
  const currentHeaders = await headers();
  const { currentUser } = await getUser(currentHeaders);

  if (!currentUser) {
    throw new Error('User not found');
  }

  const riscossi = await getRiscossi(currentHeaders);

  return (
    <main className={template.page}>
      <div className={template.header}>
        <h1>Riscossi</h1>
      </div>

      <div>
        <div className={styles.container}>
          <ul>
            {riscossi.map((riscosso) => (
              <li key={riscosso.id}>{riscosso.client}</li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
