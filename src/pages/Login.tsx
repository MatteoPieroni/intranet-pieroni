import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

import { useUser } from '../shared/hooks';
import { LoginForm, Template } from '../components';
import { PasswordResetForm } from '../components/forms/password-reset-form';

export const Login: React.FC = () => {
  const [resetting, setResetting] = useState(false);
  const [user] = useUser();
  const { id } = user;

  return (
    id ?
      <Redirect to="/home" />
      : (
        <Template>
          {resetting ? (
            <PasswordResetForm onLogin={(): void => setResetting(false)} />
          ) : (
              <LoginForm onReset={(): void => setResetting(true)} />
            )}
        </Template>
      )
  );
};
