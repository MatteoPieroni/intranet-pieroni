import { googleClient } from '@/services/google-apis';

import { Holidays } from '../holidays/holidays';
import styles from './business.module.css';
import { GoogleReviews } from '../reviews/reviews';

export const Business = async () => {
  const locations = await googleClient.getLocations();

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h2>Pagine</h2>
        <GoogleReviews locations={locations} />
      </div>

      <div className={styles.section}>
        <h2>Giorni di chiusura</h2>
        <Holidays locations={locations} />
      </div>
    </div>
  );
};
