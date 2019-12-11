import React from 'react';
import styled from '@emotion/styled';

import { IRoute } from '../../services/gmaps/driver/types';

interface IRouteProps {
  route: IRoute;
  quickest?: boolean;
}

const StyledDiv = styled.div<{ quickest?: boolean }>`
  padding: 2rem;
  background: ${(props): string => props.quickest ? 'green' : 'white'};
`;

export const Route: React.FC<IRouteProps> = ({ route, quickest }) => {
  const { name, cost, km, duration } = route;
  return (
    <StyledDiv quickest={quickest}>
      <p><strong>{name}</strong></p>
      <p><strong>{cost} €</strong> di trasporto</p>
      <p><strong>{km} km</strong> di distanza</p>
      <p><strong>{duration} min</strong> di viaggio</p>
    </StyledDiv>
  )
}
