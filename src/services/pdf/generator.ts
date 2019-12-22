import pdfMake from 'pdfmake';

export const defineFilesystem: (fileObject: IGenericProps) => void = (fileObject) => {
  pdfMake.vfs = fileObject;
}

export const generatePdf: (docDefinition: IGenericProps, options: IGenericProps) => void = (docDefinition, options) => {
  if (options) {
    Object.keys(options).map((key): void => {
      pdfMake[key] = options[key];
    })
  }

  pdfMake.createPdf(docDefinition).download()
};