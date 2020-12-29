import React from 'react';
import {
  Route,
  Redirect,
} from 'react-router-dom';

import { useUser } from '../../shared/hooks/useUser';
import { Header } from '../header/header';
import { Template } from '../template/template';

interface IPrivateRouteProps {
  children: JSX.Element | JSX.Element[];
  path: string;
  exact?: boolean;
}

interface IRouteRenderProps {
  location?: string;
}

export const PrivateRoute: (props: IPrivateRouteProps) => JSX.Element = ({ children, ...rest }) => {
  const [user] = useUser();
  const { id } = user;

  return (
    <Route
      {...rest}
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      render={(routerProps: IRouteRenderProps) =>
        id ? (
          <>
            <Header />
            <Template withHeader>
              {children}
            </Template>
          </>
        ) : (
          <Redirect
            to={{
              pathname: 'login',
              state: { referrer: routerProps.location }
            }}
          />
        )
      }
    />
  );
};
