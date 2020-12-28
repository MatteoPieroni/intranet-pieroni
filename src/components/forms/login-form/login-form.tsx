import React, { useState } from 'react';
import styled from '@emotion/styled';

import { FORM_SUCCESS_LOGIN } from '../../../common/consts';
import { loginWithMicrosoft } from '../../../services/firebase/auth';

import { LoginButton } from '../../button';
import { Notification } from '../../notification';

const StyledLoginForm = styled.div`
  margin: 2rem auto;
  padding: 1rem;
  max-width: 500px;
  background: #fff;

  h1 {
    margin-top: 0;
    color: #000;
  }
`;

export const LoginForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [fail, setFail] = useState('');

  const onLogin: () => void = async () => {
    setIsLoading(true);
    setSuccess('');
    setFail('');

    try {
      await loginWithMicrosoft();

      setSuccess(FORM_SUCCESS_LOGIN);
    } catch (e) {
      setFail(e.message);
    }

    setIsLoading(false);
  }

  return (
    <StyledLoginForm>
      <h1>Entra nella intranet Pieroni</h1>
      <LoginButton onClick={onLogin} />
      {success && <Notification variant="success" message={success} />}
      {fail && <Notification variant="fail" message={fail} />}
    </StyledLoginForm>
  )
}
