import React from 'react';
import styled from '@emotion/styled';
import { PdfForm } from '../components/forms/pdf-form';

const StyledPage = styled.main`
  padding: 1rem;
`;

export const Pdf: React.FC = () => {

  return (
    <StyledPage>
      <PdfForm />
    </StyledPage>
  )
}

export default Pdf;