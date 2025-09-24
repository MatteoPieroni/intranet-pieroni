'use client';

import { useActionState } from 'react';

import { riscossoCheckAction, StateValidation } from './issue-check-action';
import { FormStatus } from '../form-status/form-status';
import styles from './issue-check.module.css';

const initialState: StateValidation = {};

export const RiscossoCheck = ({
  id,
  isVerified,
}: {
  id: string;
  isVerified: boolean;
}) => {
  const [state, formAction, pending] = useActionState(
    riscossoCheckAction,
    initialState
  );

  return (
    <>
      <form action={formAction} className={styles.container}>
        <div className={styles.formRow}>
          <label className={styles.checkbox}>
            <input type="checkbox" name="checked" defaultChecked={isVerified} />
            Confermato
          </label>
          <input type="hidden" name="id" value={id} />
          <button type="submit" title="Salva">
            Salva
          </button>
        </div>
        {!pending && <FormStatus text={state.success} type="success" />}
        {!pending && <FormStatus text={state.error} type="error" />}
      </form>
    </>
  );
};
