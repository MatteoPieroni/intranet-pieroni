'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';

import styles from './error.module.css';
import { Illustration500 } from '@/components/illustrations/500';

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className={styles.page}>
      <div>
        <h1>Errore 500</h1>
        <p>Si è verificato un errore.</p>
      </div>
      <div>
        <Illustration500 />
      </div>
      <div>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" className="button">
          Torna alla home
        </a>
      </div>
    </main>
  );
}
