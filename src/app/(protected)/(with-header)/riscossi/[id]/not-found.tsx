import { Metadata } from 'next';

import styles from '../../not-found.module.css';
import { Illustration404 } from '@/components/illustrations/404';

export const metadata: Metadata = {
  title: 'Riscosso non trovato',
  description: 'Il riscosso che stai cercando non sembra esistere.',
};

export default async function NotFound() {
  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.noPrint}>Riscosso non trovato</h1>
      </div>
      <div className={styles.container}>
        <div className={styles.section}>
          <p>Non abbiamo trovato il riscosso che stai cercando.</p>
          <p>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/riscossi/">Vedi i riscossi</a>
          </p>
          <Illustration404 />
        </div>
      </div>
    </main>
  );
}
