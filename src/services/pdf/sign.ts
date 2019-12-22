import { generatePdf } from './generator';

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

const pdfOptions = {
  fonts: {
    SourceSans: {
      normal: 'SourceSansPro-Black.otf'
    }
  }
};

export const createSign: (text: string) => void = (text) => generatePdf({
  ...docDefinition,
  content: [
    (text ? {
      ...docDefinition.content[0],
      text,
    } :
      docDefinition.content),
  ],
}, pdfOptions);