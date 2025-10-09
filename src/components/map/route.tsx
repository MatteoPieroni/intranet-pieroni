import { Route as RouteType } from '../../services/gmaps/driver/types';
import styles from './map.module.css';

interface RouteProps {
  route: RouteType;
  quickest?: boolean;
}

export const Route = ({ route, quickest }: RouteProps) => {
  const { name, cost, km, duration } = route;
  return (
    <div className={styles.route} data-quickest={quickest}>
      <h2>{name}</h2>
      <p className={styles.cost}>
        <strong>{cost}€</strong> di trasporto
      </p>
      <ul className={styles.otherDetails}>
        <li>
          <strong>{duration} min</strong> di viaggio
        </li>
        <li>
          <strong>{km} km</strong> di distanza
        </li>
      </ul>
    </div>
  );
};
