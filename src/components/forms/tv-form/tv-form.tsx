import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import styled from '@emotion/styled';

import { updateTvText } from '../../../services/firebase/db';
import { validateMandatoryInput } from '../../../utils/validateMandatoryInput';
import { Field } from '../../form-fields';
import { Button } from '../../button';
import { useUser } from '../../../shared/hooks';

interface ILinksFormProps {
  initialState?: ITv;
  onSave: () => void;
}

interface ITv {
  text: string;
}

interface ITvError {
  text?: string;
}

const StyledLinksForm = styled.div`
  form {
    padding: 0.5rem;
  }

  .buttons-container {
    display: flex;
    justify-content: space-between;
  }
`;

export const TvForm: React.FC<ILinksFormProps> = ({ initialState, onSave }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [user] = useUser();
  const { isAdmin } = user;

  const submitLink: (values: ITv) => void = async (values) => {
    setIsSaving(true);

    try {
      await updateTvText({ text: values.text });
    } catch (e) {
      console.error(e);
    }

    if (typeof onSave === 'function') {
      onSave();
    }

    setIsSaving(false);
  };

  const validateLink: (values: ITv) => ITvError = (values) => {
    const { text } = values;
    const textError = validateMandatoryInput(text);

    return {
      ...(textError && { text: textError }),
    };
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <StyledLinksForm>
      <Formik<ITv>
        initialValues={initialState}
        onSubmit={submitLink}
        validate={validateLink}
      >
        <Form>
          <Field name="text" label="Testo" />
          <div className="buttons-container">
            {isSaving ? (
              <p>Sto salvando...</p>
            ) : (
              <Button type="submit">Salva il testo</Button>
            )}
          </div>
        </Form>
      </Formik>
    </StyledLinksForm>
  );
};
