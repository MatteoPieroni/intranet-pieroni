import React, { useState } from 'react';
import { Formik, FormikValues, FormikHelpers, Form } from 'formik';
import styled from '@emotion/styled';

import { ILink } from '../../services/firebase/types';
import { updateLink } from '../../services/firebase/db';
import { validateMandatoryInput } from '../../utils/validateMandatoryInput';
import { validateUrl } from '../../utils/validation/validateUrl';
import { Field } from '../formFields';

interface ILinksFormProps {
  initialState?: ILink;
  onSave: () => void;
}

interface ILinkError {
  link?: string;
  description?: string;
}

const newLink = {
  id: '',
  link: '',
  description: '',
  color: '',
}

const StyledLinksForm = styled.div`
  form {
    padding: .5rem;
  }
`;

export const LinksForm: React.FC<ILinksFormProps> = ({ initialState = newLink, onSave }) => {
  const [isSaving, setIsSaving] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submitLink: (values: ILink, formikHelpers: FormikHelpers<any>) => Promise<void> = async (values) => {
    const { id } = values;

    if (!id) {
      // create link
    }

    if (id) {
      await updateLink(id, values);
    }

    onSave();
    console.log(values);
  }

  const validateLink: (values: ILink) => ILinkError = (values) => {
    const { link, description } = values;
    const urlError = validateUrl(link);
    const descriptionError = validateMandatoryInput(description);

    return {
      ...(urlError && { link: urlError }),
      ...(descriptionError && { description: descriptionError }),
    }
  }

  return (
    <StyledLinksForm>
      <Formik initialValues={initialState} onSubmit={submitLink} validate={validateLink}>
        <Form>
          <Field name="id" hidden />
          <Field name="link" label="Indirizzo" />
          <Field name="description" label="Descrizione" />
          <Field name="color" label="Colore" />
          {isSaving ?
            <p>Sto salvando...</p> :
            <button type="submit">Salva questo link</button>
          }
        </Form>
      </Formik>
    </StyledLinksForm>
  )
}
