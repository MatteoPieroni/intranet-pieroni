import React from 'react';
import styled from '@emotion/styled';

import { IRoute } from '../../services/gmaps/driver/types';

interface IRouteProps {
  route: IRoute;
  quickest?: boolean;
}

const StyledDiv = styled.div<{ quickest?: boolean }>`
  border-bottom: 1px solid #ccc;
  padding: 1rem 1rem 2rem;
  background: ${(props): string => props.quickest ? 'green' : 'white'};
  color: ${(props): string => props.quickest ? 'white' : '#333'};

  h2 {
    margin-bottom: .75rem;
    font-size: 1.2rem;
    color: ${(props): string => props.quickest ? 'white' : '#333'};
    text-decoration: underline;
  }

  .cost {
    margin-bottom: .5rem;
  }

  .other-details {
    li {
      margin-bottom: .25rem;
    }
  }
`;

export const Route: React.FC<IRouteProps> = ({ route, quickest }) => {
  const { name, cost, km, duration } = route;
  return (
    <StyledDiv quickest={quickest}>
      <h2>{name}</h2>
      <p className="cost"><strong>{cost}€</strong> di trasporto</p>
      <ul className="other-details">
        <li><strong>{duration} min</strong> di viaggio</li>
        <li><strong>{km} km</strong> di distanza</li>
      </ul>
    </StyledDiv>
  )
}
