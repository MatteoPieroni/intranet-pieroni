import { headers } from 'next/headers';
import dynamic from 'next/dynamic';
import type { Metadata } from 'next';

import { getConfig, cachedGetUser } from '@/services/firebase/server';
import styles from './page.module.css';
import { HomeIcon } from '@/components/icons/home';
import { HeaderModal } from '@/components/header/header';

const LazyMap = dynamic(() =>
  import('@/components/map/map').then((mod) => mod.Map)
);

export const metadata: Metadata = {
  title: 'Calcola percorso - Intranet Pieroni srl',
  description: 'Intranet - calcola il costo di consegna',
};

export default async function Maps() {
  const authHeader = (await headers()).get('Authorization');
  const { currentUser } = await cachedGetUser(authHeader);
  const config = await getConfig(authHeader);

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/"
          className={`button ${styles.homeLink}`}
          title="Torna alla home"
        >
          <HomeIcon role="presentation" />
        </a>
        <h1>Calcola il costo di trasporto</h1>
        <div className={styles.mobileMenuContainer}>
          {currentUser && (
            <HeaderModal
              permissions={currentUser.permissions}
              mailUrl={config.mailUrl}
              theme={currentUser.theme}
            />
          )}
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.panel}>
          <div className={styles.search}>
            <label htmlFor="autocomplete">Inserisci l&#39;indirizzo</label>
            <input id="autocomplete" type="text" className={styles.field} />
          </div>
          <LazyMap
            transportCostMinimum={config.transportCostMinimum}
            transportCostPerMinute={config.transportCostPerMinute}
            transportHourBase={config.transportHourBase}
          />
        </div>

        <div id="map" className={`${styles.map} skeleton`} />
      </div>

      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS}&libraries=places&loading=async`}
      ></script>
    </main>
  );
}
