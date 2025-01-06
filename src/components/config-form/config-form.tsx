'use client';

import { PropsWithChildren, useActionState } from 'react';

import { configAction, StateValidation } from './config-action';
import styles from './config-form.module.css';
import { FormStatus } from '../form-status/form-status';

const initialState: StateValidation = {};

export const ConfigForm = ({ children }: PropsWithChildren) => {
  const [state, formAction, pending] = useActionState(
    configAction,
    initialState
  );

  return (
    <form action={formAction}>
      <div className={styles.container}>
        {children}
        <div className={styles.buttonsContainer}>
          <button type="submit">Salva</button>
        </div>
      </div>
      {!pending && <FormStatus text={state.success} type="success" />}
      {!pending && <FormStatus text={state.error} type="error" />}
    </form>
  );
};
