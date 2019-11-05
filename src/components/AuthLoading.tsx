import React from 'react';

import { useUser } from '../shared/hooks/useUser';
import { Redirect } from 'react-router';

interface IAuthLoadingProps {
  to?: string;
}

export const AuthLoading: (props: IAuthLoadingProps) => JSX.Element = ({ to }) => {
  const [user, hasLoaded] = useUser();
  const { id } = user;

  return (
    id ?
      <Redirect to="home" />
      :
      <Redirect to="login" />
  );
};
