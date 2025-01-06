import type { Metadata } from 'next';

import { PdfForm } from '@/components/pdf-form/pdf-form';
import styles from './page.module.css';
import template from '../header-template.module.css';

export const metadata: Metadata = {
  title: 'Crea cartello - Intranet Pieroni srl',
  description: 'Intranet - crean un cartello da stampare',
};

export default async function Home() {
  return (
    <main className={template.page}>
      <div className={template.header}>
        <h1>Stampa un cartello</h1>
      </div>

      <div>
        <div className={styles.container}>
          <h2>Ricordati di rispettare questi punti:</h2>
          <ul className={styles.list}>
            <li>Sii concis*</li>
            <li>
              Comincia (dove appropriato) con &#34;Si avvisa la gentila
              clientela...&#34;
            </li>
            <li>Indica che il primo e l&#39;ultimo giorno sono compresi</li>
          </ul>
          <PdfForm />
        </div>
      </div>
    </main>
  );
}
