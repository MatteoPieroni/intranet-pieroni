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

import { useUser } from '../shared/hooks/useUser';

import { PrivateRoute } from './PrivateRoute';
import { AdminRoute } from './AdminRoute';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { AuthLoading } from './AuthLoading';
import { Admin } from '../pages/Admin';
import { Sms } from '../pages/Sms';

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
