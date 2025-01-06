import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

import styles from './page.module.css';
import {
  getUser,
  getLinks,
  getQuoteWithImages,
  getTvText,
  getConfigOnServer,
} from '@/services/firebase/server';
import { TvForm } from '@/components/tv-form/tv-form';
import { LinkForm } from '@/components/link-form/link-form';
import { EColor } from '@/services/firebase/db-types';
import { QuoteForm } from '@/components/quote-form/quote-form';
import template from '../header-template.module.css';
import { ConfigForm } from '@/components/config-form/config-form';

export const metadata: Metadata = {
  title: 'Admin - Intranet Pieroni srl',
  description: 'Intranet - gestisci le impostazioni',
};

export default async function Admin() {
  const currentHeaders = await headers();
  const { currentUser } = await getUser(currentHeaders);

  const isAdmin = currentUser?.isAdmin;
  const canEditTransport = currentUser?.scopes?.config?.transport;

  const [links, quote, tvText, config] = await Promise.all([
    getLinks(currentHeaders),
    isAdmin ? getQuoteWithImages(currentHeaders) : undefined,
    getTvText(currentHeaders),
    getConfigOnServer(currentHeaders),
  ]);

  if (!isAdmin && !canEditTransport) {
    redirect('/');
  }

  return (
    <main className={template.page}>
      <div className={template.header}>
        <h1>Gestisci</h1>
      </div>
      <div className={styles.container}>
        {isAdmin && (
          <>
            <div className={styles.section}>
              <h2>Link</h2>
              <div className={styles.linksContainer}>
                {links.map((link) => (
                  <LinkForm key={link.id} link={link} />
                ))}
                <LinkForm
                  link={{
                    description: '',
                    link: '',
                    id: '',
                    color: EColor.amber,
                  }}
                  isNew
                />
              </div>
            </div>
            {/* typeguard, TS cannot determine that if isAdmin === true => quote is populated */}
            {quote && (
              <div className={styles.section}>
                <h2>Citazione</h2>
                <QuoteForm
                  text={quote.quote.text}
                  currentImage={quote.quote.url}
                  images={quote.images}
                />
              </div>
            )}
            <div className={styles.section}>
              <h2>Testo Tv</h2>
              <TvForm tvText={tvText.text} />
            </div>
          </>
        )}
        {(canEditTransport || isAdmin) && (
          <div className={styles.section}>
            <h2>Configurazione</h2>
            <ConfigForm>
              {isAdmin && (
                <label>
                  Url mail
                  <input name="mailUrl" defaultValue={config.mailUrl} />
                </label>
              )}
              <label>
                Costo trasporto al minuto
                <input
                  type="number"
                  name="transportCostPerMinute"
                  defaultValue={config.transportCostPerMinute}
                />
              </label>
              <label>
                Costo trasporto minimo
                <input
                  type="number"
                  name="transportCostMinimum"
                  defaultValue={config.transportCostMinimum}
                />
              </label>
              <label>
                Ore base trasporto
                <input
                  type="number"
                  name="transportHourBase"
                  defaultValue={config.transportHourBase}
                />
              </label>
            </ConfigForm>
          </div>
        )}
      </div>
    </main>
  );
}
