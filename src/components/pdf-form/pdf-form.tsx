'use client';

import { useState, FormEvent } from 'react';
import {
  Document,
  Page,
  Text,
  StyleSheet,
  Font,
  Image,
  View,
  PDFDownloadLink,
} from '@react-pdf/renderer';

import { FORM_FAIL_PDF, ERROR_FIELD_TOO_LONG } from '../../consts';

import styles from './pdf-form.module.css';
import { FormStatus } from '../form-status/form-status';

Font.register({
  family: 'SourceSans',
  src: '/assets/SourceSans3-Black.ttf',
});

const pdfStyles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
  },
  imageContainer: {
    display: 'flex',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    maxWidth: '15%',
  },
  text: {
    fontFamily: 'SourceSans',
    fontSize: 47,
    marginTop: 134,
    marginHorizontal: 118,
    alignment: 'center',
  },
  footer: {
    backgroundColor: '#ee8900',
    height: 100,
    position: 'absolute',
    left: 50,
    right: 50,
    bottom: 0,
  },
});

const Cartello = ({ text }: { text: string }) => (
  <Document>
    <Page size="A4" orientation="landscape">
      <View style={pdfStyles.imageContainer}>
        <Image src="/assets/pieroni-logo.jpg" style={pdfStyles.image} />
      </View>
      <Text style={pdfStyles.text}>{text}</Text>
      <View style={pdfStyles.footer}></View>
    </Page>
  </Document>
);

export const PdfForm: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [text, setText] = useState('');
  const [fail, setFail] = useState('');

  const printPdf = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const values = new FormData(event.currentTarget);

    setIsSaving(true);
    setFail('');

    const formText = values.get('text');

    const text = String(formText);
    if (!text) {
      setFail(FORM_FAIL_PDF);
      setIsSaving(false);
      return;
    }

    if (text.length > 140) {
      setFail(ERROR_FIELD_TOO_LONG);
      setIsSaving(false);
      return;
    }

    setText(text);
    setIsSaving(false);
  };

  return (
    <form onSubmit={printPdf} method="POST">
      <label>
        Scrivi il tuo testo qui sotto
        <textarea name="text" className={styles.textarea} required />
      </label>
      {!isSaving && <FormStatus text={fail} type="error" />}
      <div className={styles.buttonsContainer}>
        {!text ? (
          <button type="submit" aria-disabled={isSaving}>
            Genera cartello
          </button>
        ) : (
          <>
            <PDFDownloadLink
              document={<Cartello text={text} />}
              fileName="cartello.pdf"
              className="button"
            >
              {({ loading }) =>
                loading ? 'Stiamo generando il cartello' : 'Scarica il cartello'
              }
            </PDFDownloadLink>
          </>
        )}
      </div>
    </form>
  );
};
