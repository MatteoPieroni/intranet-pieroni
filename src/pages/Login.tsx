import React from 'react';
import { Redirect, useLocation } from 'react-router-dom';

import { useUser } from '../shared/hooks';
import { LoginForm, Template } from '../components';

export const Login: React.FC = () => {
  const [user] = useUser();
  const { id } = user;

  const location = useLocation();

  return (
    id ?
      <Redirect to={location?.state?.referrer || '/'} />
      : (
        <Template>
          <LoginForm />
        </Template>
      )
  );
};
