import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';

import { fireApp, fireAuth } from './services/firebase';
import { UserProvider } from './shared/context/user';

import { Routes } from './components/Routes';

export const App = () => (
  <>
    <UserProvider>
      <Routes />
    </UserProvider>
  </>
);

ReactDOM.render(<App />, document.getElementById('app'));
