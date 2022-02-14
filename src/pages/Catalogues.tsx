import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { CataloguesArchive } from '../components/catalogues-archive';
import 'react-contexify/dist/ReactContexify.css';
import { useConfig } from '../shared/hooks';
import { Loader } from '../components';

const StyledPage = styled.main`
  padding: 1rem;
`;

export const Catalogues: React.FC = () => {
  const { isInternal, checkInternal } = useConfig();

  useEffect(() => {
    if (isInternal === undefined) {
      checkInternal();
    }
  }, [isInternal]);

  const isLoading = isInternal === undefined;

  return (
    <StyledPage>
      {isLoading ? (
        <Loader />
      ) : (
        <CataloguesArchive />
      )}
    </StyledPage>
  )
}

export default Catalogues;