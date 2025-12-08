import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

import styles from './page.module.css';
import {
  cachedGetUser,
  getQuoteWithImages,
  getTvText,
  getLinksWithoutCache,
  getConfigWithoutCache,
  cachedGetTeams,
} from '@/services/firebase/server';
import { TvForm } from '@/components/tv-form/tv-form';
import { LinkForm } from '@/components/link-form/link-form';
import { QuoteForm } from '@/components/quote-form/quote-form';
import template from '../header-template.module.css';
import { ConfigForm } from '@/components/config-form/config-form';
import {
  checkCanEditConfig,
  checkIsAdmin,
} from '@/services/firebase/server/permissions';

export const metadata: Metadata = {
  title: 'Admin - Intranet Pieroni srl',
  description: 'Intranet - gestisci le impostazioni',
};

export default async function Admin() {
  const currentHeaders = await headers();
  const { currentUser } = await cachedGetUser(currentHeaders);

  const isAdmin = checkIsAdmin(currentUser?.permissions);
  const canEditConfig = checkCanEditConfig(currentUser?.permissions);

  const [links, quote, tvText, config, teams] = await Promise.all([
    getLinksWithoutCache(currentHeaders),
    // TODO: is this needed?
    isAdmin ? getQuoteWithImages(currentHeaders) : undefined,
    getTvText(currentHeaders),
    getConfigWithoutCache(currentHeaders),
    cachedGetTeams(currentHeaders),
  ]);

  if (!canEditConfig) {
    return redirect('/');
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
                  <LinkForm key={link.id} link={link} availableTeams={teams} />
                ))}
                <LinkForm
                  link={{
                    description: '',
                    link: '',
                    id: '',
                    teams: [],
                  }}
                  isNew
                  availableTeams={teams}
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
        <div className={styles.section}>
          <h2>Configurazione</h2>
          <ConfigForm>
            {isAdmin && (
              <label>
                Url mail
                <input name="mailUrl" defaultValue={config.mailUrl} />
              </label>
            )}
            {isAdmin && (
              <label>
                Email per nuovi riscossi
                <input
                  name="emailRiscossi"
                  required
                  type="email"
                  defaultValue={config.emailRiscossi}
                />
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
      </div>
    </main>
  );
}
