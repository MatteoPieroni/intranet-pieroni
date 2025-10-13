import { Metadata } from 'next';

import styles from '../../not-found.module.css';

export const metadata: Metadata = {
  title: 'Modulo qualità non trovato',
  description: 'Il modulo qualità che stai cercando non sembra esistere.',
};

export default async function NotFound() {
  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.noPrint}>Modulo non trovato</h1>
      </div>
      <div className={styles.container}>
        <div className={styles.section}>
          <p>Non abbiamo trovato il modulo che stai cercando.</p>
          <p>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/issues/">Vedi i moduli qualità</a>
          </p>
        </div>
      </div>
    </main>
  );
}
