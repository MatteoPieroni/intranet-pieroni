import React, { Fragment } from 'react';
import {
  Route,
  Redirect,
} from 'react-router-dom';

import { useUser } from '../shared/hooks/useUser';
import { Header } from './Header';

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
      // tslint:disable-next-line: jsx-no-lambda
      render={({ location }) =>
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
