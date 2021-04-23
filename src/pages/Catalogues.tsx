import React from 'react';
import styled from '@emotion/styled';
import { CataloguesArchive } from '../components/catalogues-archive';
import 'react-contexify/dist/ReactContexify.css';

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