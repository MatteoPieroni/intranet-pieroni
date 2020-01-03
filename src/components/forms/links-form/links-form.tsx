import React, { useState } from 'react';
import { Formik, FormikHelpers, Form } from 'formik';
import styled from '@emotion/styled';

import { ILink } from '../../../services/firebase/types';
import { updateLink, addLink, removeLink } from '../../../services/firebase/db';
import { validateMandatoryInput } from '../../../utils/validateMandatoryInput';
import { validateUrl } from '../../../utils/validation/validateUrl';
import { Field } from '../../form-fields';
import { Icon } from '../../icons';
import { Button } from '../../button';

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

  .buttons-container {
    display: flex;
    justify-content: space-between;
  }
`;

export const LinksForm: React.FC<ILinksFormProps> = ({ initialState = newLink, onSave }) => {
  const [isSaving, setIsSaving] = useState(false);
  const { id } = initialState;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submitLink: (values: ILink, formikHelpers: FormikHelpers<any>) => void = async (values, { resetForm }) => {
    const { id } = values;
    setIsSaving(true);

    try {
      if (!id) {
        await addLink(values);
      }

      if (id) {
        await updateLink(id, values);
      }
    } catch (e) {
      console.log(e);
    }

    if (typeof onSave === 'function') {
      onSave();
    }

    setIsSaving(false);
    resetForm({});
    console.log(values);
  }

  const deleteLink = (): void => {
    const { id } = initialState;
    try {
      removeLink(id);
    } catch (e) {
      console.log(e);
    }
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
          <div className="buttons-container">
            {id && (
              <Button onClick={deleteLink} icon={Icon.Trash} ghost testId="link-delete-button">Rimuovi questo link</Button>
            )
            }
            {isSaving ?
              <p>Sto salvando...</p> :
              <Button type="submit">Salva questo link</Button>
            }
          </div>
        </Form>
      </Formik>
    </StyledLinksForm>
  )
}
