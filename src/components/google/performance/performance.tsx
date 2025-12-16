import { googleClient, type Location } from '@/services/google-apis';
import sharedStyles from '../shared.module.css';
import styles from './performance.module.css';

type GooglePerformanceProps = {
  locations: Location[];
};

export const GooglePerformance = async ({
  locations,
}: GooglePerformanceProps) => {
  const performance = await googleClient.getPagePerformance(
    locations.map((location) => location.name)
  );
  const locationsWithPerformance = locations.map((location) => ({
    ...location,
    performance: performance.find(
      (performanceLocation) => performanceLocation.name === location.name
    ),
  }));

  return (
    <>
      <div className={sharedStyles.twoGrid}>
        {locationsWithPerformance.map((location) => (
          <div key={location.name}>
            <h3 className={sharedStyles.title}>
              {location.title} - {location.storefrontAddress.locality}
            </h3>
            <div className={styles.performanceContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">Ricerca</th>
                    <th scope="col"> Maps</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{location.performance?.search}</td>
                    <td>{location.performance?.maps}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
      <p className={styles.footer}>
        Le impressioni avute nelle ricerche su Google o nelle ricerche su Google
        Maps, questo mese.
      </p>
    </>
  );
};
