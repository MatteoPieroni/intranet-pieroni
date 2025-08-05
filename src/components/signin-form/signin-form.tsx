'use client';

import { FORM_FAIL_LOGIN, FORM_SUCCESS_LOGIN } from '@/consts';
import {
  clientConfig,
  onAuthStateChanged,
  signInWithGoogle,
} from '@/services/firebase/client';
import { useEffect, useState } from 'react';
import { FormStatus } from '../form-status/form-status';

export function useUserSession(onUserSignin: () => void) {
  // Register the service worker that sends auth state back to server
  // The service worker is built with npm run build-service-worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const serializedFirebaseConfig = encodeURIComponent(
        JSON.stringify(clientConfig)
      );
      const serviceWorkerUrl = `/auth-service-worker.js?firebaseConfig=${serializedFirebaseConfig}`;

      navigator.serviceWorker
        .register(serviceWorkerUrl)
        .then((registration) => console.log('scope is: ', registration.scope));
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser) => {
      if (authUser) {
        onUserSignin();
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export const SignInForm = ({ userError }: { userError?: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [fail, setFail] = useState('');
  useUserSession(() => {});

  const onLogin: () => void = async () => {
    setIsLoading(true);
    setFail('');

    try {
      await signInWithGoogle();
      setSuccess(FORM_SUCCESS_LOGIN);
    } catch (e) {
      if (e instanceof Error) {
        setFail(e.message);
        return;
      }

      setFail(FORM_FAIL_LOGIN);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onLogin();
      }}
    >
      <button aria-disabled={isLoading}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="3.7cm"
          height="1.4cm"
          viewBox="0 0 104 41"
          role="img"
          aria-labelledby="login-image-title"
        >
          <title id="login-image-title">
            Accedi con l&apos;account Microsoft
          </title>
          <image
            width="104"
            height="41"
            transform="translate(0 0)"
            xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGgAAAApCAIAAABWevs/AAAACXBIWXMAAAsSAAALEgHS3X78AAAAsklEQVRoQ+3ZsQ1AQBhAYURrCBOcBSRGsAxDsIwRJBZgAkNYQKN0wSvlfe1/1XOKP5eGEBJ9lz0d0D3DQYaDDAcZDjIcZDjIcJDhIMNB+dOBy1IesVG9F+24xaZT98+VzhsHGQ4yHGQ4yHCQ4SDDQYaDUt8cmLebw9bNsVEYm3WIbg5V/88P468KGQ4yHGQ4yHCQ4SDDQYaD3BwgbxxkOMhwkOEgw0GGgwwHGQ4yHGQ46ASCtA37LAi+FAAAAABJRU5ErkJggg=="
            style={{ isolation: 'isolate' }}
          />
          <g style={{ isolation: 'isolate' }}>
            <path
              d="M54.5,25.3H52.7l-.9-2.5h-4l-.9,2.5H45.1l3.8-10.1h1.9Zm-3.2-3.9-1.4-4a2,2,0,0,0-.1-.7h0a6.4,6.4,0,0,1-.2.7l-1.3,4Z"
              fill="#fff"
            />
            <path
              d="M60.9,25a4.6,4.6,0,0,1-2.1.5,3.2,3.2,0,0,1-2.5-1,3.4,3.4,0,0,1-1-2.6,3.9,3.9,0,0,1,1-2.9,4,4,0,0,1,2.9-1.1,4.7,4.7,0,0,1,1.7.4v1.5a2.8,2.8,0,0,0-3.3.1,2.9,2.9,0,0,0-.7,1.9,2.1,2.1,0,0,0,.7,1.7,1.9,1.9,0,0,0,1.6.7,2.7,2.7,0,0,0,1.7-.6Z"
              fill="#fff"
            />
            <path
              d="M67.7,25a4.6,4.6,0,0,1-2.1.5,3.4,3.4,0,0,1-2.6-1,3.8,3.8,0,0,1-1-2.6A4,4,0,0,1,63.1,19a3.8,3.8,0,0,1,2.8-1.1,4.8,4.8,0,0,1,1.8.4v1.5a2.5,2.5,0,0,0-1.6-.5,2.4,2.4,0,0,0-1.7.6,2.5,2.5,0,0,0-.7,1.9,2.4,2.4,0,0,0,.6,1.7,2.1,2.1,0,0,0,1.7.7,2.9,2.9,0,0,0,1.7-.6Z"
              fill="#fff"
            />
            <path
              d="M75.4,22.2H70.5a2,2,0,0,0,.6,1.5,2.1,2.1,0,0,0,1.6.5,3.7,3.7,0,0,0,2.1-.6v1.3a4.8,4.8,0,0,1-2.6.6,3,3,0,0,1-2.5-1,3.9,3.9,0,0,1-.9-2.8,3.6,3.6,0,0,1,1-2.7,3.4,3.4,0,0,1,2.5-1.1,3.1,3.1,0,0,1,2.3,1,4,4,0,0,1,.8,2.6ZM73.8,21a2.1,2.1,0,0,0-.4-1.4,1.5,1.5,0,0,0-1.1-.4,1.3,1.3,0,0,0-1.2.5,1.6,1.6,0,0,0-.6,1.3Z"
              fill="#fff"
            />
            <path
              d="M83.5,25.3H81.8V24.1h0a2.6,2.6,0,0,1-2.4,1.4,2.4,2.4,0,0,1-2.1-1,3.5,3.5,0,0,1-.8-2.6,5,5,0,0,1,.8-2.9,3,3,0,0,1,2.4-1.1,2.1,2.1,0,0,1,2.1,1.2h0V14.7h1.7ZM81.9,22v-.9a1.9,1.9,0,0,0-.5-1.3,1.7,1.7,0,0,0-1.3-.5,2,2,0,0,0-1.5.6,3.6,3.6,0,0,0-.5,1.9,3.2,3.2,0,0,0,.5,1.8,1.8,1.8,0,0,0,1.4.6,1.6,1.6,0,0,0,1.3-.6A2.1,2.1,0,0,0,81.9,22Z"
              fill="#fff"
            />
            <path
              d="M86.4,16.6a1.1,1.1,0,0,1-.7-.3c-.2-.1-.2-.3-.2-.6a.8.8,0,0,1,.2-.7,1,1,0,0,1,.7-.2.8.8,0,0,1,.7.2.9.9,0,0,1,.3.7.7.7,0,0,1-.3.6A.9.9,0,0,1,86.4,16.6Zm.8,8.7H85.6V18.1h1.6Z"
              fill="#fff"
            />
          </g>
        </svg>
      </button>

      {!isLoading && <FormStatus text={fail} type="error" />}
      {!isLoading && <FormStatus text={success} type="success" />}
      {userError && <FormStatus text={userError} type="error" />}
    </form>
  );
};
