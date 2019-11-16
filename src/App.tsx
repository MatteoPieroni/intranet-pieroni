import React, { Fragment } from 'react';
import { Global, css } from '@emotion/core';
import 'reset-css';

import { UserProvider } from './shared/context/user';
import { Routes } from './components/Routes';

const globalCss = css`
  body {
    font-family: Roboto, Helvetica Neue, sans-serif;
  }
  div, ul, p, a, li {
    box-sizing: border-box;
  }
`;

export const App: React.FC = () => (
  <>
    <Global styles={globalCss} />
    <UserProvider>
      <Routes />
    </UserProvider>
  </>
);