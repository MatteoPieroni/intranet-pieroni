'use client';

import { useEffect, useState } from 'react';

import { mapConfig, Driver, TransportCost } from '@/services/gmaps';
import type { TCurrent, TTransportCost } from '@/services/gmaps/driver/types';
import { Route } from './route';
import styles from './map.module.css';

type MapProps = {
  transportCostMinimum: number;
  transportCostPerMinute: number;
  transportHourBase: number;
};

export const Map = ({
  transportCostMinimum,
  transportCostPerMinute,
  transportHourBase,
}: MapProps) => {
  const [routeData, setRouteData] = useState({} as TCurrent);

  useEffect(() => {
    if (typeof window === undefined) {
      return;
    }

    if (!('google' in window) || !(window.google instanceof Object)) {
      return;
    }

    if (!('maps' in window.google)) {
      return;
    }

    const gmaps = window.google && window.google.maps;

    if (!gmaps) {
      throw new Error('Qualcosa non va con Google Maps');
    }

    if (!document.getElementById(mapConfig.div)) {
      return;
    }

    let mapsDriver: TTransportCost | null = null;
    const initMap = setTimeout(() => {
      mapsDriver = new TransportCost(
        Driver,
        {
          ...mapConfig,
          costs: {
            costPerMinute: transportCostPerMinute,
            hourBase: transportHourBase,
            minimumCost: transportCostMinimum,
          },
        },
        gmaps
      );
      mapsDriver.initialise();
      mapsDriver.subscribe(setRouteData);
    }, 1000);

    return (): void => {
      clearTimeout(initMap);
      if (mapsDriver) mapsDriver.unsubscribe(setRouteData);
    };
  }, [transportCostMinimum, transportCostPerMinute, transportHourBase]);

  const { destination, routes, cost } = routeData;
  const quickestRoute =
    routes && routes.filter((route) => route.cost === cost)[0];
  const remainingRoutes =
    routes &&
    routes
      .filter((route) => route.name !== quickestRoute?.name)
      .sort((a, b) => (+a.cost > +b.cost ? 1 : -1));

  return (
    routes &&
    routes.length > 0 && (
      <div className={styles.results}>
        <h2 className={styles.destination}>
          Destinazione
          <br />
          <strong>{destination}</strong>
        </h2>
        {quickestRoute && <Route route={quickestRoute} quickest />}
        {remainingRoutes?.map((route) => (
          <Route key={route.name} route={route} />
        ))}
      </div>
    )
  );
};
