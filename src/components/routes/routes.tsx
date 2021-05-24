import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import { useUser } from '../../shared/hooks/useUser';

import { PrivateRoute } from './private-route';
import { Loader } from '../loader';
import { Login } from '../../pages/Login';

const Home = React.lazy(() => import('../../pages/Home'));
const Sms = React.lazy(() => import('../../pages/Sms'));
const Maps = React.lazy(() => import('../../pages/Maps'));
const Pdf = React.lazy(() => import('../../pages/Pdf'));
const Catalogues = React.lazy(() => import('../../pages/Catalogues'));

export const Routes: () => JSX.Element = () => {
  const [, hasLoaded] = useUser();

  return (
    <Router>
      {
        hasLoaded ? (
            <Suspense fallback={<Loader />}>
              <Switch>
                <PrivateRoute exact path="/">
                  <Home />
                </PrivateRoute>
                <PrivateRoute path="/sms">
                  <Sms />
                </PrivateRoute>
                <PrivateRoute path="/maps">
                  <Maps />
                </PrivateRoute>
                <PrivateRoute path="/cartello">
                  <Pdf />
                </PrivateRoute>
                <PrivateRoute path="/cataloghi">
                  <Catalogues />
                </PrivateRoute>
                <Route path="/login">
                  <Login />
                </Route>
              </Switch>
            </Suspense>
          ) :
          <Loader />
      }
    </Router>
  );
};
