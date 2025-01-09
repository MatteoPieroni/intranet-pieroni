import type { Location } from '@/services/google-apis';
import { AddHoliday } from './add-holiday';
import { filterPeriods, mapPeriod } from './holidays.utils';
import styles from './holidays.module.css';

type HolidayProps = {
  locations: Location[];
};

const dateFormatter = new Intl.DateTimeFormat('it-IT', {
  dateStyle: 'medium',
});

export const Holidays = ({ locations }: HolidayProps) => {
  return (
    <div className={styles.twoGrid}>
      {locations.map((location) => (
        <div key={location.name} className={styles.section}>
          <h3 className={styles.title}>
            {location.storefrontAddress.locality}
          </h3>
          <div className={styles.content}>
            <ul className={styles.list}>
              {location.specialHours.specialHourPeriods
                .filter(filterPeriods)
                .map(mapPeriod)
                .map((day) =>
                  day.date ? (
                    <li key={day.date.toString()}>
                      {dateFormatter.format(day.date)}
                    </li>
                  ) : (
                    <li key={day.startDate.toString()}>
                      Dal {dateFormatter.format(day.startDate)} al{' '}
                      {dateFormatter.format(day.endDate)}
                    </li>
                  )
                )}
            </ul>

            <div className={styles.addSection}>
              <h4>Aggiungi date</h4>
              <AddHoliday
                name={location.name}
                previousDates={location.specialHours.specialHourPeriods.filter(
                  filterPeriods
                )}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
