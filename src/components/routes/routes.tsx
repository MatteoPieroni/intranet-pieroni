import React, { Fragment, useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation,
} from 'react-router-dom';

import { useUser } from '../../shared/hooks/useUser';

import { PrivateRoute } from './private-route';
import { AdminRoute } from './admin-route';
import { Home } from '../../pages/Home';
import { Login } from '../../pages/Login';
import { AuthLoading } from '../auth-loading/auth-loading';
import { Admin } from '../../pages/Admin';
import { Sms } from '../../pages/Sms';
import { Maps } from '../../pages/Maps';
import { Pdf } from '../../pages/Pdf';

export const Routes: () => JSX.Element = () => {
  const [user, hasLoaded] = useUser();

  const { id } = user;

  return (
    <Router>
      {
        hasLoaded ? (
          id ? (
            <>
              <Switch>
                <Route path="/login">
                  <Login />
                </Route>
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
                <AdminRoute path="/admin">
                  <Admin />
                </AdminRoute>
              </Switch>
            </>
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
          <div>Loading;...</div >
      }
    </Router>
  );
};
