import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Formik, Form, FormikHelpers } from 'formik';

import { pdfVfs } from '../../../common/pdfVfs';
import { defineFilesystem, createSign } from '../../../services/pdf';

import { Field } from '../../form-fields';
import { Button } from '../../button';
import { Notification } from '../../notification';
import { FORM_SUCCESS_PDF, FORM_FAIL_PDF } from '../../../common/consts';
import { validateMandatoryInput } from '../../../utils/validateMandatoryInput';
import { validateLength } from '../../../utils/validation/validateLength';

interface IPdf {
  text: string;
}

interface IPdfError {
  text?: string;
}

const StyledSmsForm = styled.div`
  margin: 2rem auto;
  padding: 1rem;
  max-width: 500px;
  background: #fff;

  h1 {
    margin-top: 0;
    color: #000;
  }

  h2 {
    margin-bottom: .75rem;
  }

  .list {
    margin-left: 1.2rem;
    margin-bottom: 1.5rem;
    list-style: unset;

    li {
      margin-bottom: .5rem;
      line-height: 1.3rem
    }
  }

  .field-container {
    margin-bottom: .75rem;
  }

  textarea {
    height: 8rem;
  }

  .buttons-container {
    display: flex;
    justify-content: space-between;
  }
`;

const newPdf: IPdf = {
  text: '',
}

export const PdfForm: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [fail, setFail] = useState('');

  useEffect(() => {
    defineFilesystem(pdfVfs);

    return (): void => {
      defineFilesystem({});
    };
  }, [])

  const printPdf: (values: IPdf, formikHelpers: FormikHelpers<any>) => void = (values, { resetForm }) => {
    setIsSaving(true);
    setSuccess('');
    setFail('');

    const { text } = values;
    // const textWritten = text.toUpperCase();
    try {
      if (!window.Cypress) {
        createSign(text);
      }

      setSuccess(FORM_SUCCESS_PDF);
      resetForm({});
    } catch (e) {
      console.error(e);
      setFail(FORM_FAIL_PDF);
    }

    setIsSaving(false);
  }

  const validatePdf: (values: IPdf) => IPdfError = (values) => {
    const { text } = values;
    const textError = validateMandatoryInput(text) || validateLength(text, 140);

    return {
      ...(textError && { text: textError }),
    }
  }

  return (
    <StyledSmsForm>
      <h1>Stampa un cartello</h1>
      <div className="instructions">
        <h2>Ricordati di rispettare questi punti:</h2>
        <ul className="list">
          <li>
            Sii concis*
            </li>
          <li>
            Comincia (dove appropriato) con &#34;Si avvisa la gentila clientela...&#34;
            </li>
          <li>
            Indica che il primo e l&#39;ultimo giorno sono compresi
            </li>
        </ul>
      </div>
      <Formik initialValues={newPdf} onSubmit={printPdf} validate={validatePdf}>
        <Form>
          <Field name="text" label="Scrivi il tuo testo qui sotto" as="textarea" />
          <div className="buttons-container">
            {isSaving ?
              <p>Sto salvando...</p> :
              <Button type="submit">Scarica il cartello</Button>
            }
          </div>
        </Form>
      </Formik>
      {success && <Notification variant="success" message={success} />}
      {fail && <Notification variant="fail" message={fail} />}
    </StyledSmsForm >
  )
}
