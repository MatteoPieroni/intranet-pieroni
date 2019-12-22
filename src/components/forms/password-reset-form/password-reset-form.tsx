import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Formik, Form, FormikHelpers } from 'formik';

import { validateMandatoryInput } from '../../../utils/validateMandatoryInput';
import { FORM_SUCCESS_RESET, FORM_FAIL_RESET } from '../../../common/consts';

import { Field } from '../../form-fields';
import { Button } from '../../button';
import { Notification } from '../../notification';
import { passwordReset } from '../../../services/firebase/auth';

interface IReset {
  email: string;
}

interface IResetFormProps {
  onSave?: () => void;
  onLogin: () => void;
}

interface IResetError {
  email?: string;
}

const StyledLoginForm = styled.div`
  margin: 2rem auto;
  padding: 1rem;
  max-width: 500px;
  background: #fff;

  h1 {
    margin-top: 0;
    color: #000;
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

  a {
    display: inline-block;
    margin: 1rem 0;
  }
`;

const newReset: IReset = {
  email: '',
}

export const PasswordResetForm: React.FC<IResetFormProps> = ({ onLogin }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [fail, setFail] = useState('');

  const onSubmitReset: (values: IReset, formikHelpers: FormikHelpers<any>) => void = async (values, { resetForm }) => {
    setIsSaving(true);
    setSuccess('');
    setFail('');

    try {
      const { email } = values;

      await passwordReset(email);

      setSuccess(FORM_SUCCESS_RESET);
      resetForm({});
    } catch (e) {
      setFail(e.message);
    }

    setIsSaving(false);
  }

  const validateLogin: (values: IReset) => IResetError = (values) => {
    const { email } = values;
    const emailError = validateMandatoryInput(email);

    return {
      ...(emailError && { email: emailError }),
    }
  }

  return (
    <StyledLoginForm>
      <h1>Resetta la tua password</h1>
      <Formik initialValues={newReset} onSubmit={onSubmitReset} validate={validateLogin}>
        <Form>
          <Field name="email" label="Email" />
          <div className="buttons-container">
            {isSaving ?
              <p>Inviando la mail...</p> :
              <Button type="submit">Resetta la password</Button>
            }
          </div>
        </Form>
      </Formik>
      {success && <Notification variant="success" message={success} />}
      {fail && <Notification variant="fail" message={fail} />}
      <a onClick={onLogin} href="#!">Entra usando i tuoi dati</a>
    </StyledLoginForm>
  )
}
