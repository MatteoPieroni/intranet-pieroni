import type { Metadata } from 'next';

import styles from './page.module.css';
import template from '../header-template.module.css';
import { getRiscossi, getUser } from '@/services/firebase/server';
import { headers } from 'next/headers';
import { RiscossiForm } from '@/components/riscosso-form/riscosso-form';

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

      <div className={styles.container}>
        <div className={styles.section}>
          <ul>
            {riscossi.map((riscosso) => (
              <li key={riscosso.id}>
                {riscosso.client} - {riscosso.date.toDateString()}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.container}>
          <RiscossiForm isNew riscosso={undefined} />
        </div>
      </div>
    </main>
  );
}
