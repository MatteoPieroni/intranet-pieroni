import React from 'react';
import { Formik, FormikValues, FormikHelpers, Form } from 'formik';

import { IQuote } from '../../services/firebase/types';
import { validateMandatoryInput } from '../../utils/validateMandatoryInput';
import { Field } from '../formFields';
import { validateUrl } from '../../utils/validation/validateUrl';

interface IQuoteFormProps {
  initialState?: FormikValues & true;
}

interface IQuoteError {
  text?: string;
  url?: string;
}

const newQuote = {
  text: '',
  url: ''
}

export const QuoteForm: React.FC<IQuoteFormProps> = ({ initialState = newQuote }) => {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submitQuote: (values: IQuote, formikHelpers: FormikHelpers<any>) => Promise<void> = async (values) => {

    // await updateQuote(id, values);
    console.log(values);
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
    <Formik initialValues={initialState} onSubmit={submitQuote} validate={validateQuote}>
      <Form>
        <Field name="text" as="textarea" label="Descrizione" />
        <Field name="url" label="Indirizzo" />
        <button type="submit">Salva la citazione</button>
      </Form>
    </Formik>
  )
}
