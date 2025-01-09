import { googleClient } from '@/services/google-apis';

import { Holidays } from '../holidays/holidays';
import styles from './business.module.css';
import { GooglePosts } from '../google-posts/google-posts';

export const Business = async () => {
  const locations = await googleClient.getLocations();
  console.log({ locations });

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h2>Pagine</h2>
        <Holidays locations={locations} />
      </div>

      <div className={styles.section}>
        <h2>Giorni di chiusura</h2>
        <Holidays locations={locations} />
      </div>
      <div className={styles.section}>
        <h2>Post</h2>
        <GooglePosts name={locations[0].name} />
      </div>
    </div>
  );
};
