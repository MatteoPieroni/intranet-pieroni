import { Metadata } from 'next';

import styles from '../../not-found.module.css';

export const metadata: Metadata = {
  title: 'Accesso non permesso',
  description: 'Non hai i permessi per vedere il riscosso che stai cercando.',
};

export default async function Forbidden() {
  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.noPrint}>Accesso non permesso</h1>
      </div>
      <div className={styles.container}>
        <div className={styles.section}>
          <p>Non hai i permessi per vedere il riscosso che stai cercando.</p>
          <p>Chiedi ad un amministratore.</p>
          <p>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/riscossi/">Vedi i riscossi</a>
          </p>
        </div>
      </div>
    </main>
  );
}
