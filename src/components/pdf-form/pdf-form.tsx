'use client';

import { useState, useEffect, FormEvent } from 'react';

import { pdfVfs } from '../../services/pdf/pdfVfs';
import { defineFilesystem, createSign } from '../../services/pdf';

import {
  FORM_SUCCESS_PDF,
  FORM_FAIL_PDF,
  ERROR_EMPTY_FIELD,
  ERROR_FIELD_TOO_LONG,
} from '../../consts';

import styles from './pdf-form.module.css';

export const PdfForm: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [fail, setFail] = useState('');

  useEffect(() => {
    defineFilesystem(pdfVfs);

    return (): void => {
      defineFilesystem({});
    };
  }, []);

  const printPdf: (event: FormEvent<HTMLFormElement>) => void = (event) => {
    event.preventDefault();

    const values = new FormData(event.currentTarget);

    setIsSaving(true);
    setSuccess('');
    setFail('');

    const formText = values.get('text');

    const text = String(formText);
    // const textWritten = text.toUpperCase();
    if (!text) {
      setFail(ERROR_EMPTY_FIELD);
      return;
    }

    if (text.length > 140) {
      setFail(ERROR_FIELD_TOO_LONG);
      return;
    }

    try {
      createSign(text);
      setSuccess(FORM_SUCCESS_PDF);
    } catch (e) {
      console.error(e);
      setFail(FORM_FAIL_PDF);
    }

    setIsSaving(false);
  };

  return (
    <form onSubmit={printPdf}>
      <p aria-live="polite">{success}</p>

      <label>
        Scrivi il tuo testo qui sotto
        <textarea name="text" className={styles.textarea} />
        {fail}
      </label>
      <div className={styles.buttonsContainer}>
        <button type="submit" disabled={isSaving}>
          Scarica il cartello
        </button>
      </div>
    </form>
    // {success && <Notification variant="success" message={success} />}
    // {fail && <Notification variant="fail" message={fail} />}
  );
};
