'use client';

import { useActionState } from 'react';

import { tvAction, StateValidation } from './tv-action';

const initialState: StateValidation = {};

type TvFormProps = {
  tvText: string;
};

export const TvForm = ({ tvText }: TvFormProps) => {
  const [state, formAction, pending] = useActionState(tvAction, initialState);

  return (
    <form action={formAction}>
      <p aria-live="polite">{state.success}</p>
      <label>
        Messaggio (ricordati di disattivare il maiuscolo)
        <textarea name="message" defaultValue={tvText} />
        {state.error}
      </label>
      <div>
        <button type="submit" disabled={pending}>
          Aggiorna il messaggio
        </button>
      </div>
    </form>
  );
};
