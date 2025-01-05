'use client';

import { useActionState } from 'react';

import type { ILink } from '@/services/firebase/db-types';
import { linkAction, linkDeleteAction, StateValidation } from './link-action';
import styles from './link-form.module.css';

type LinksFormProps = {
  link: ILink;
  isNew?: boolean;
};
const initialState: StateValidation = {};

export const LinkForm = ({
  link: { description, link, id },
  isNew = false,
}: LinksFormProps) => {
  const [state, formAction, pending] = useActionState(linkAction, initialState);

  return (
    <form action={formAction}>
      <div className={styles.container}>
        <label>
          Descrizione
          <input name="description" defaultValue={description} />
          {state.errors?.description}
        </label>
        <label>
          Link
          <input name="link" defaultValue={link} />
          {state.errors?.link}
        </label>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="isNew" value={isNew ? 'NEW' : ''} />
        <div className={styles.buttonsContainer}>
          <button type="submit" disabled={pending}>
            {!isNew ? 'Salva' : 'Aggiungi'}
          </button>
          <button formAction={() => linkDeleteAction(id)}>Rimuovi</button>
        </div>
      </div>
      <p aria-live="polite" className={styles.status}>
        {state.success} {state.errors?.general}
      </p>
    </form>
  );
};
