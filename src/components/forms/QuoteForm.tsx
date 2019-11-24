import React, { useState } from 'react';
import { Formik, FormikValues, FormikHelpers, Form } from 'formik';
import styled from '@emotion/styled';

import { IQuote } from '../../services/firebase/types';
import { validateMandatoryInput } from '../../utils/validateMandatoryInput';
import { Field } from '../formFields';
import { validateUrl } from '../../utils/validation/validateUrl';
import { Button } from '../button';
import { updateQuote } from '../../services/firebase/db';
import { useQuote } from '../../shared/hooks/useQuote';

interface IQuoteFormProps {
  initialState?: IQuote;
  className: string;
  onSave?: () => void;
}

interface IQuoteError {
  text?: string;
  url?: string;
}

const newQuote = {
  text: '',
  url: ''
}

const StyledDiv = styled.div`
  .textarea {
    border: none;
    padding: 0.5rem;
    height: 8rem;
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
    font-size: 1.5rem;

    &:focus {
      outline: 1px solid rgba(255,255,255,.7);
    }
  }
`;

export const QuoteForm: React.FC<IQuoteFormProps> = ({ initialState = newQuote, className, onSave }) => {
  const [isSaving, setIsSaving] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submitQuote: (values: IQuote, formikHelpers: FormikHelpers<any>) => Promise<void> = async (values) => {

    try {
      setIsSaving(true);

      await updateQuote(values);
      typeof onSave === 'function' && onSave();
    } catch (e) {
      console.log(e);
    }

    setIsSaving(false);
  }

  const validateQuote: (values: IQuote) => IQuoteError = (values) => {
    const { text, url } = values;
    const urlError = validateUrl(url);
    const textError = validateMandatoryInput(text);

    return {
      ...(urlError && { url: urlError }),
      ...(textError && { text: textError }),
    }
  }

  return (
    <StyledDiv>
      <Formik initialValues={initialState} onSubmit={submitQuote} validate={validateQuote}>
        <Form className={className}>
          <Field name="text" as="textarea" label="Descrizione" className="textarea" />
          {/* <Field name="url" label="Indirizzo" /> */}
          {isSaving ?
            <p>Sto salvando...</p> :
            <Button type="submit">Salva la citazione</Button>
          }
        </Form>
      </Formik>
    </StyledDiv>
  )
}
