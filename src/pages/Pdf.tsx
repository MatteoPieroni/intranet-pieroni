import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';

import { pdfVfs } from '../common/pdfVfs';
import { defineFilesystem, createSign } from '../services/pdf';

const StyledPage = styled.main`
`;

export const Pdf: React.FC = () => {
  const [text, setText] = useState('');

  useEffect(() => {
    defineFilesystem(pdfVfs);

    return (): void => {
      defineFilesystem({});
    };
  }, [])

  const printPdf = (): void => {
    // const textWritten = text.toUpperCase();
    createSign(text);
  }

  return (
    <StyledPage>
      <h1>Stampa un cartello</h1>
      <button onClick={printPdf}>Stampa</button>
    </StyledPage>
  )
}
