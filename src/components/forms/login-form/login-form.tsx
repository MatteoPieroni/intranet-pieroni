import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Formik, Form, FormikHelpers } from 'formik';

import { validateMandatoryInput } from '../../../utils/validateMandatoryInput';
import { FORM_SUCCESS_LOGIN } from '../../../common/consts';

import { Field } from '../../form-fields';
import { Button } from '../../button';
import { Notification } from '../../notification';
import { login } from '../../../services/firebase/auth';

interface ILogin {
  email: string;
  password: string;
}

interface ILoginFormProps {
  onSave?: () => void;
  onReset: () => void;
}

interface ILoginError {
  email?: string;
  password?: string;
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

const newLogin: ILogin = {
  email: '',
  password: '',
}

export const LoginForm: React.FC<ILoginFormProps> = ({ onReset }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [fail, setFail] = useState('');

  const onSubmitSms: (values: ILogin, formikHelpers: FormikHelpers<any>) => void = async (values, { resetForm }) => {
    setIsSaving(true);
    setSuccess('');
    setFail('');

    try {
      const { email, password } = values;

      await login({ email, password });

      setSuccess(FORM_SUCCESS_LOGIN);
      resetForm({});
    } catch (e) {
      setFail(e.message);
    }

    setIsSaving(false);
  }

  const validateLogin: (values: ILogin) => ILoginError = (values) => {
    const { email, password } = values;
    const emailError = validateMandatoryInput(email);
    const passwordError = validateMandatoryInput(password);

    return {
      ...(emailError && { email: emailError }),
      ...(passwordError && { password: passwordError }),
    }
  }

  return (
    <StyledLoginForm>
      <h1>Entra nella intranet Pieroni</h1>
      <Formik initialValues={newLogin} onSubmit={onSubmitSms} validate={validateLogin}>
        <Form>
          <Field name="email" label="Email" />
          <Field name="password" label="Password" type="password" />
          <div className="buttons-container">
            {isSaving ?
              <p>Verificando...</p> :
              <Button type="submit">Entra</Button>
            }
          </div>
        </Form>
      </Formik>
      {success && <Notification variant="success" message={success} />}
      {fail && <Notification variant="fail" message={fail} />}
      <a onClick={onReset}>Resetta la tua password</a>
    </StyledLoginForm>
  )
}
