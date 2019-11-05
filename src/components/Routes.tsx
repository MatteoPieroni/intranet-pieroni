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
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { AuthLoading } from './AuthLoading';
import { Header } from './Header';

export const Routes: () => JSX.Element = () => {
  const [user, hasLoaded] = useUser();

  const { id } = user;

  return (
    <Router>
      {
        hasLoaded ? (
          id ? (
            <>
              <Redirect to="home" />
            </>
          ) :
            <Redirect to="login" />
        ) :
          <div>Loading;...</div >
      }
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
      </Switch>
    </Router>
  );
};
