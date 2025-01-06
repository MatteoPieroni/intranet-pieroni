'use client';

import { useState, useEffect, FormEvent } from 'react';

import { pdfVfs } from '../../services/pdf/pdfVfs';
import { defineFilesystem, createSign } from '../../services/pdf';

import {
  FORM_SUCCESS_PDF,
  FORM_FAIL_PDF,
  ERROR_FIELD_TOO_LONG,
} from '../../consts';

import styles from './pdf-form.module.css';
import { FormStatus } from '../form-status/form-status';

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
        <textarea name="text" className={styles.textarea} required />
      </label>
      {!isSaving && <FormStatus text={fail} type="error" />}
      <div className={styles.buttonsContainer}>
        <button type="submit" disabled={isSaving}>
          Scarica il cartello
        </button>
      </div>
      {!isSaving && <FormStatus text={success} type="success" />}
    </form>
  );
};
