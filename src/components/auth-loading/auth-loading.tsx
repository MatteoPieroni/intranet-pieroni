import React from 'react';
import { Redirect } from 'react-router-dom';

import { useUser } from '../../shared/hooks';

interface IAuthLoadingProps {
  to?: string;
}

export const AuthLoading: (props: IAuthLoadingProps) => JSX.Element = () => {
  const [user] = useUser();
  const { id } = user;

  return (
    id ?
      <Redirect to="home" />
      :
      <Redirect to="login" />
  );
};
