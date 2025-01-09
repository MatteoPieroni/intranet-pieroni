import { googleClient, type Location } from '@/services/google-apis';
import sharedStyles from '../shared.module.css';
import styles from './reviews.module.css';
import { StarIcon } from '@/components/icons/star';
import { StarHalfIcon } from '@/components/icons/star-half';

type GoogleReviewsProps = {
  locations: Location[];
};

const Stars = ({ rating }: { rating: number }) => {
  const starsArray = [];
  for (let i = 0; i <= 4; i++) {
    if (rating > i + 1) {
      starsArray.push(1);
      continue;
    }

    const remainingRating = rating - i;

    if (remainingRating > 0) {
      starsArray.push((rating - i).toFixed(1));
      continue;
    }

    starsArray.push(0);
  }

  return (
    <>
      {starsArray.map((value, i) => (
        <div className={styles.star} key={i}>
          {value === 0 ? (
            <StarIcon isEmpty />
          ) : value === 1 ? (
            <StarIcon />
          ) : (
            <StarHalfIcon />
          )}
        </div>
      ))}
    </>
  );
};

export const GoogleReviews = async ({ locations }: GoogleReviewsProps) => {
  const reviews = await googleClient.getReviewRating(
    locations.map((location) => location.name)
  );
  const locationsWithReviews = locations.map((location) => ({
    ...location,
    reviews: reviews.find((review) => review.id === location.name),
  }));

  return (
    <div className={sharedStyles.twoGrid}>
      {locationsWithReviews.map((location) => (
        <div key={location.name}>
          <h3 className={sharedStyles.title}>
            {location.storefrontAddress.locality}
          </h3>
          <div className={styles.ratingContainer}>
            {location.reviews?.averageRating ? (
              <>
                <p className={styles.rating}>
                  {location.reviews?.averageRating}
                </p>
                <div className={styles.stars}>
                  <Stars rating={location.reviews.averageRating} />
                </div>
                <div>
                  <a href={location.metadata.mapsUri} target="_blank">
                    {location.reviews?.number} review
                  </a>
                </div>
              </>
            ) : (
              'Non disponibile'
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
