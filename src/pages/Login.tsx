import React from 'react';
import { Redirect } from 'react-router-dom';

import { fireAuth } from '../services/firebase';
import { useUser } from '../shared/hooks';

export const Login = () => {
  const [user, hasLoaded] = useUser();
  const { id, isAdmin } = user;

  console.log({ id });

  const login: () => void = () => fireAuth.login({ email: '', password: '' });

  return (
    id ?
      <Redirect to="/home" />
      :
      <button onClick={login}>Log in</button>
  );
};
