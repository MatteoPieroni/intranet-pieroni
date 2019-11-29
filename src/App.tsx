import React from 'react';
import { Global, css } from '@emotion/core';
import 'reset-css';

import { UserProvider } from './shared/context/user';
import { Routes } from './components/Routes';

const globalCss = css`
  html, body {
    height: 100%;
  }

  body {
    font-family: Roboto, Helvetica Neue, sans-serif;
  }

  div, ul, p, a, li {
    box-sizing: border-box;
  }

  .main-app {
    height: 100%;
  }

  .modal {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 90vw;
    background: #fff;
    transform: translate(-50%, -50%);

    @media (min-width: 1024px) {
      width: 60vw;
    }
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