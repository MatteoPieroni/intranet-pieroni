import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { TransportCost, Driver, config } from '../services/gmaps';
import { TTransportCost, TCurrent } from '../services/gmaps/driver/types';
import { Route } from '../components/route/route';

const StyledPage = styled.main`
  #map {
    height: 90vh;
  }
`;

export const Maps: React.FC = () => {
  const [routeData, setRouteData] = useState({} as TCurrent);

  useEffect(() => {
    let mapsDriver: TTransportCost = null;
    const initMap = setTimeout(() => {
      mapsDriver = new TransportCost(Driver, config);
      mapsDriver.initialise();
      mapsDriver.subscribe(setRouteData);
    }, 1000);

    return (): void => {
      clearTimeout(initMap);
      mapsDriver.unsubscribe(setRouteData);
    }
  }, []);

  const {
    routes,
    cost,
  } = routeData;
  const quickestRoute = routes && routes.filter(route => route.cost !== cost)[0];
  const remainingRoutes = routes && routes.filter(route => route.name !== quickestRoute.name);
  console.log({ quickestRoute, remainingRoutes })

  return (
    <StyledPage>
      <div id="map" />
      <input id="autocomplete" placeholder="Inserisci l'indirizzo" type="text" />
      {routes && routes.length > 0 && (
        <div className="results">
          <Route route={quickestRoute} quickest />
          {remainingRoutes.map(route => <Route key={route.name} route={route} />)}
        </div>
      )}
    </StyledPage>
  )
}
