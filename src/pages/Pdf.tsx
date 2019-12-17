import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import pdfMake from 'pdfmake';

import { pdfVfs } from '../common/pdfVfs';

const StyledPage = styled.main`
  .preview {
    height: 450px;
    width: 636.3px;
    background: #000;
    /* transform: rotate(-90deg); */
  }

  #to-print {
    transform: scale(.5);
  }
`;

export const Pdf: React.FC = () => {

  useEffect(() => {
    pdfMake.vfs = pdfVfs;

    return (): void => {
      pdfMake.vfs = {};
    };
  }, [])

  const printPdf = (): void => {
    // const textWritten = text.toUpperCase();
    const docDefinition = {
      pageOrientation: 'landscape',
      header: {
        image: 'header.jpg'
      },
      footer: {
        image: 'footer.jpg'
      },
      content: [
        {
          text: 'Si comunica alla gentile clientela che rimarremo chiusi il giorno 8 dicembre ',
          // text: textWritten,
          style: 'communication'
        }
      ],

      styles: {
        communication: {
          fontSize: 47,
          margin: [118, 134, 118, 0],
          alignment: 'center'
        }
      },
      defaultStyle: {
        font: 'SourceSans'
      }
    };
    pdfMake.fonts = {
      SourceSans: {
        normal: 'SourceSansPro-Black.otf'
      }
    };

    pdfMake.createPdf(docDefinition).download();
  }
  return (
    <StyledPage>
      <h1>Stampa un cartello</h1>
      <div className="preview">
        <div id="to-print">

          <img src="assets/logo-pieroni.png" />
          CIAO
        </div>
      </div>
      <button onClick={printPdf}>Stampa</button>
    </StyledPage>
  )
}
