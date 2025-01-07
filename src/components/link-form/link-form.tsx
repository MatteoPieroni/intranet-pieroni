'use client';

import { useActionState } from 'react';

import type { ILink } from '@/services/firebase/db-types';
import { linkAction, linkDeleteAction, StateValidation } from './link-action';
import styles from './link-form.module.css';
import { FormStatus } from '../form-status/form-status';
import { DeleteIcon } from '../icons/delete';
import { SaveIcon } from '../icons/save';

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
          <input name="description" defaultValue={description} required />
        </label>
        <label>
          Link
          <input type="url" name="link" defaultValue={link} required />
        </label>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="isNew" value={isNew ? 'NEW' : ''} />
        <div className={styles.buttonsContainer}>
          <button type="submit" title={!isNew ? 'Salva' : 'Aggiungi'}>
            {!isNew ? <SaveIcon role="presentation" /> : 'Aggiungi'}
          </button>
          {!isNew && (
            <button
              formAction={() => linkDeleteAction(id)}
              title={`Rimuovi ${description}`}
            >
              <DeleteIcon role="presentation" />
            </button>
          )}
        </div>
      </div>
      {!pending && <FormStatus text={state.success} type="success" />}
      {!pending && <FormStatus text={state.error} type="error" />}
    </form>
  );
};
