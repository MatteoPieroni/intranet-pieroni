import type { Metadata } from 'next';

import styles from './page.module.css';
import template from '../../header-template.module.css';
import { getRiscosso, getUser } from '@/services/firebase/server';
import { headers } from 'next/headers';
import { RiscossiForm } from '@/components/riscosso-form/riscosso-form';

export const metadata: Metadata = {
  title: 'Riscossi - Intranet Pieroni srl',
  description: 'Intranet - vedi i riscossi',
};

export default async function Riscossi({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const currentHeaders = await headers();
  const { currentUser } = await getUser(currentHeaders);

  if (!currentUser) {
    throw new Error('User not found');
  }

  const riscosso = await getRiscosso(currentHeaders, id);

  return (
    <main className={template.page}>
      <div className={template.header}>
        <h1>Riscosso {id}</h1>
      </div>

      <div className={styles.container}>
        <div className={styles.section}>
          {riscosso.id} - {riscosso.client} - {riscosso.client}
        </div>
        <div className={styles.section}>
          <RiscossiForm riscosso={riscosso} />
        </div>
      </div>
    </main>
  );
}
