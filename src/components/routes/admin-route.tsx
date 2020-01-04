import React from 'react';
import {
  Route,
  Redirect,
} from 'react-router-dom';

import { useUser } from '../../shared/hooks';
import { Header } from '../header';

interface IPrivateRouteProps {
  children: JSX.Element | JSX.Element[];
  path: string;
}

export const AdminRoute: (props: IPrivateRouteProps) => JSX.Element = ({ children, ...rest }) => {
  const [user] = useUser();
  const { isAdmin } = user;

  return (
    <Route
      {...rest}
      render={(): React.ReactElement =>
        isAdmin ? (
          <>
            <Header />
            {children}
          </>
        ) : (
            <Redirect to="home" />
          )
      }
    />
  );
};
