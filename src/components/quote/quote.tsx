import React from 'react';

import { IQuote } from '@/services/firebase/db-types';
import styles from './quote.module.css';

interface IQuoteProps {
  quote: IQuote;
}

export const Quote: React.FC<IQuoteProps> = ({ quote }) => {
  const { url, text } = quote;

  return (
    <>
      <div className={styles.header}>
        <h2 data-testid="quote-title">Citazione del mese</h2>
      </div>
      <div className={`${styles.quote} skeleton`}>
        <img src={url} alt="" />
        <p>{text}</p>
      </div>
    </>
  );
};
