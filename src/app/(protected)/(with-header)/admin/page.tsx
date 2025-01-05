import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import styles from './page.module.css';
import {
  getUser,
  getLinks,
  getQuoteWithImages,
  getTvText,
} from '@/services/firebase/server';
import { TvForm } from '@/components/tv-form/tv-form';
import { LinkForm } from '@/components/link-form/link-form';
import { EColor } from '@/services/firebase/db-types';
import { QuoteForm } from '@/components/quote-form/quote-form';
import template from '../header-template.module.css';

export default async function Admin() {
  const currentHeaders = await headers();
  const { currentUser } = await getUser(currentHeaders);
  const [links, quote, tvText] = await Promise.all([
    getLinks(currentHeaders),
    getQuoteWithImages(currentHeaders),
    getTvText(currentHeaders),
  ]);

  if (!currentUser?.isAdmin) {
    redirect('/');
  }

  return (
    <main className={template.page}>
      <div className={template.header}>
        <h1>Gestisci</h1>
      </div>
      <div className={styles.container}>
        <div className={styles.section}>
          <h2>Link</h2>
          <div className={styles.linksContainer}>
            {links.map((link) => (
              <LinkForm key={link.id} link={link} />
            ))}
            <LinkForm
              link={{ description: '', link: '', id: '', color: EColor.amber }}
              isNew
            />
          </div>
        </div>
        <div className={styles.section}>
          <h2>Citazione</h2>
          <QuoteForm
            text={quote.quote.text}
            currentImage={quote.quote.url}
            images={quote.images}
          />
        </div>
        <div className={styles.section}>
          <h2>Testo Tv</h2>
          <TvForm tvText={tvText.text} />
        </div>
      </div>
    </main>
  );
}
