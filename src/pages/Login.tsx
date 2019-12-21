import React from 'react';
import { Redirect } from 'react-router-dom';

import { useUser } from '../shared/hooks';
import { LoginForm, Template } from '../components';

export const Login: React.FC = () => {
  const [user] = useUser();
  const { id } = user;

  return (
    id ?
      <Redirect to="/home" />
      : (
        <Template>
          <LoginForm />
        </Template>
      )
  );
};
