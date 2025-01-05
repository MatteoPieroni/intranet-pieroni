'use client';

import { useActionState } from 'react';

import styles from './sms-form.module.css';
import { smsAction, StateValidation } from './sms-action';

const initialState: StateValidation = {};

export const SmsForm = () => {
  const [state, formAction, pending] = useActionState(smsAction, initialState);

  return (
    <form action={formAction}>
      <p aria-live="polite">{state.success}</p>
      <label>
        Numero
        <input type="text" name="number" />
        {state.errors?.number}
      </label>

      <label>
        Messaggio (ricordati di disattivare il maiuscolo)
        <textarea name="message" className={styles.textarea} />
        {state.errors?.message}
      </label>
      <div className={styles.buttonsContainer}>
        <button type="submit" disabled={pending}>
          Invia il messaggio
        </button>
      </div>
    </form>
  );
};
