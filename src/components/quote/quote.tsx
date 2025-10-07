import React from 'react';

import { Quote as QuoteType } from '@/services/firebase/db-types';
import styles from './quote.module.css';

interface QuoteProps {
  quote: QuoteType;
}

export const Quote: React.FC<QuoteProps> = ({ quote }) => {
  const { url, text } = quote;

  return (
    <>
      <div className={styles.header}>
        <h2 data-testid="quote-title">Citazione del mese</h2>
      </div>
      <div className={`${styles.quote} skeleton`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="" />
        <p>{text}</p>
      </div>
    </>
  );
};
