import { headers } from 'next/headers';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { getConfigOnServer } from '@/services/firebase/server';
import styles from './page.module.css';

const LazyMap = dynamic(() =>
  import('@/components/map/map').then((mod) => mod.Map)
);

export default async function Maps() {
  const currentHeaders = await headers();
  const config = await getConfigOnServer(currentHeaders);

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <Link href="/">Home</Link>
        <h1>Calcola il costo di trasporto</h1>
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
      <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCQAsPDMeU5gkpK_b6anN-uUJQtoeWhop8&libraries=places&loading=async"></script>
    </main>
  );
}
