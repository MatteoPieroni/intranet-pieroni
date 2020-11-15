import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import { useUser } from '../../shared/hooks/useUser';

import { PrivateRoute } from './private-route';
import { AuthLoading } from '../auth-loading';
import { Loader } from '../loader';
import { Login } from '../../pages/Login';

const Home = React.lazy(() => import('../../pages/Home'));
const Sms = React.lazy(() => import('../../pages/Sms'));
const Maps = React.lazy(() => import('../../pages/Maps'));
const Pdf = React.lazy(() => import('../../pages/Pdf'));
const Mail = React.lazy(() => import('../../pages/Mail'));

export const Routes: () => JSX.Element = () => {
  const [user, hasLoaded] = useUser();

  const { id } = user;

  return (
    <Router>
      {
        hasLoaded ? (
          id ? (
            <Suspense fallback={<Loader />}>
              <Redirect to="/home" />
              <Switch>
                <Route path="/authLoading">
                  <AuthLoading />
                </Route>
                <PrivateRoute path="/home">
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
                <PrivateRoute path="/mail">
                  <Mail />
                </PrivateRoute>
              </Switch>
            </Suspense>
          ) : (
              <>
                <Switch>
                  <Route path="/login">
                    <Login />
                  </Route>
                </Switch>
                <Redirect to="login" />
              </>
            )) :
          <Loader />
      }
    </Router>
  );
};
