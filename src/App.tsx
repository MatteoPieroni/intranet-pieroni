import React, { Suspense } from 'react';
import { Global, css } from '@emotion/core';
import 'reset-css';
import 'whatwg-fetch';

import { Loader } from './components';
const Routes = React.lazy(() => import('./components/routes'));
const UserProvider = React.lazy(() => import('./shared/context/user'));

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

  a {
    position: relative;
    letter-spacing: 1px;
    color: #333;
    text-decoration: underline;
    cursor: pointer;

    &:focus {
      outline: 2px solid #D79922;
    }
  }

  button {
    border: none;
    background: none;
    font-family: Roboto, Helvetica Neue, sans-serif;
  }

  h1 {
    margin-top: .5rem;
    margin-bottom: 1.5rem;
    border-bottom: 4px solid;
    padding-bottom: .5rem;
    font-size: 2rem;
    font-weight: 600;
    color: #fff;
  }
  
  strong {
    font-weight: 600;
  }

  .main-app {
    height: 100%;
  }

  .modal {
    position: absolute;
    top: 50%;
    left: 50%;
    padding: 1rem;
    width: 90vw;
    background: #fff;
    transform: translate(-50%, -50%);
    box-shadow:0 1px 5px rgba(0,0,0,0.3);

    @media (min-width: 1024px) {
      width: 60vw;
    }

    &.modal-small {
      @media (min-width: 1024px) {
        min-width: 330px;
        width: auto;
        max-width: 60vw;
      }
    }
  }

  .visually-hidden {
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }
`;

export const App: React.FC = () => (
  <>
    <Suspense fallback={<Loader />}>
      <Global styles={globalCss} />
      <UserProvider>
        <Routes />
      </UserProvider>
    </Suspense>
  </>
);