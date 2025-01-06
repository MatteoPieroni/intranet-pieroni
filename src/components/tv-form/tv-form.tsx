'use client';

import { useActionState } from 'react';

import { tvAction, StateValidation } from './tv-action';
import { FormStatus } from '../form-status/form-status';
import styles from './tv-form.module.css';

const initialState: StateValidation = {};

type TvFormProps = {
  tvText: string;
};

export const TvForm = ({ tvText }: TvFormProps) => {
  const [state, formAction, pending] = useActionState(tvAction, initialState);

  return (
    <form action={formAction}>
      <label>
        Messaggio (ricordati di disattivare il maiuscolo)
        <textarea name="message" defaultValue={tvText} required />
      </label>
      <div className={styles.buttonContainer}>
        <button type="submit">Aggiorna il messaggio</button>
      </div>

      {!pending && <FormStatus text={state.success} type="success" />}
      {!pending && <FormStatus text={state.error} type="error" />}
    </form>
  );
};
