import React from 'react';
import {
  Route,
} from 'react-router-dom';

import { useUser } from '../../shared/hooks/useUser';
import { Header } from '../header/header';
import { Template } from '../template/template';

interface IPrivateRouteProps {
  children: JSX.Element | JSX.Element[];
  path: string;
}

export const PrivateRoute: (props: IPrivateRouteProps) => JSX.Element = ({ children, ...rest }) => {
  const [user] = useUser();
  const { id } = user;

  return (
    <Route
      {...rest}
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      render={() =>
        id ? (
          <>
            <Header />
            <Template>
              {children}
            </Template>
          </>
        ) : (
            null
          )
      }
    />
  );
};
