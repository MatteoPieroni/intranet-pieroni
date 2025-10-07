import pdfMake from 'pdfmake';

interface GenericProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export const defineFilesystem: (fileObject: GenericProps) => void = (
  fileObject
) => {
  pdfMake.vfs = fileObject;
};

export const generatePdf: (
  docDefinition: GenericProps,
  options: GenericProps
) => void = (docDefinition, options) => {
  if (options) {
    Object.keys(options).map((key): void => {
      pdfMake[key] = options[key];
    });
  }

  pdfMake.createPdf(docDefinition).download();
};
