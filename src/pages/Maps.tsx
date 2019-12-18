import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';

import { TransportCost, Driver, config } from '../services/gmaps';
import { TTransportCost, TCurrent } from '../services/gmaps/driver/types';
import { Route } from '../components';

const StyledPage = styled.main`
  display: flex;

  h1 {
    margin: 1rem;
    font-size: 1.3rem;
    color: #333;
  }

  .panel {
    display: flex;
    flex-direction: column;
    width: 30%;
    height: calc(100vh - 3rem);
    background: #fff;
    box-shadow: 1px 0 2px rgba(0,0,0,.25);
    z-index: 2;
  }

  .search {
    padding: 1rem;

    label {
      display: block;
      margin-bottom: .35em;
      font-size: 1.2em;
    }

    .field {
      margin-bottom: .5em;
      padding: .25em;
      width: 100%;
      font-size: 1em;
      color: #000;
      box-sizing: border-box;
    }
  }

  .destination {
    margin: 1rem;
  }

  #map {
    width: 70%;
    height: calc(100vh - 3rem);
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
    destination,
    routes,
    cost,
  } = routeData;
  const quickestRoute = routes && routes.filter(route => route.cost === cost)[0];
  const remainingRoutes = routes && routes.filter(route => route.name !== quickestRoute.name).sort((a, b) => (+a.cost > +b.cost) ? 1 : -1);

  return (
    <StyledPage>
      <div className="panel">
        <h1>Calcola il costo di trasporto</h1>
        <div className="search">
          <label htmlFor="autocomplete">Inserisci l&#39;indirizzo</label>
          <input id="autocomplete" type="text" className="field" />
        </div>
        {routes && routes.length > 0 && (
          <div className="results">
            <h2 className="destination">
              Destinazione
              <br />
              <strong>{destination}</strong>
            </h2>
            <Route route={quickestRoute} quickest />
            {remainingRoutes.map(route => <Route key={route.name} route={route} />)}
          </div>
        )}
      </div>
      <div id="map" />
    </StyledPage>
  )
}

export default Maps;