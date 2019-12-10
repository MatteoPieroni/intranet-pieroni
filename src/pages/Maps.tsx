import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { TransportCost, Driver, config } from '../services/gmaps';

const StyledPage = styled.main`
  #map {
    height: 90vh;
  }
`;

export const Maps: React.FC = () => {

  useEffect(() => {
    let mapsDriver;
    const initMap = setTimeout(() => {
      console.log('ciao')
      mapsDriver = new TransportCost(Driver, config);
      mapsDriver.initialise();
    }, 1000);

    return () => clearTimeout(initMap);
  }, [])

  return (
    <StyledPage>
      <div id="map" />
      <input id="autocomplete" placeholder="Inserisci l'indirizzo" type="text" />
    </StyledPage>
  )
}
