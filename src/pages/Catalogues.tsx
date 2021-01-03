import React from 'react';
import styled from '@emotion/styled';
import { CataloguesArchive } from '../catalogues-archive/catalogues-archive';

const StyledPage = styled.main`
  padding: 1rem;
`;

export const Catalogues: React.FC = () => {

  return (
    <StyledPage>
      <CataloguesArchive />
    </StyledPage>
  )
}

export default Catalogues;