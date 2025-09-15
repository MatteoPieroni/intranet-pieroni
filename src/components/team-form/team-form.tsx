'use client';

import { useActionState } from 'react';

import type { ITeam } from '@/services/firebase/db-types';
import { teamAction, teamDeleteAction, StateValidation } from './team-action';
import styles from './team-form.module.css';
import { FormStatus } from '../form-status/form-status';
import { DeleteIcon } from '../icons/delete';
import { SaveIcon } from '../icons/save';

type LinksFormProps = {
  team: ITeam;
  isNew?: boolean;
};
const initialState: StateValidation = {};

export const TeamForm = ({
  team: { name, id },
  isNew = false,
}: LinksFormProps) => {
  const [state, formAction, pending] = useActionState(teamAction, initialState);

  return (
    <form action={formAction}>
      <div className={styles.container}>
        <label>
          Nome
          <input type="text" name="name" defaultValue={name} required />
        </label>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="isNew" value={isNew ? 'NEW' : ''} />
        <div className={styles.buttonsContainer}>
          <button type="submit" title={!isNew ? 'Salva' : 'Aggiungi'}>
            {!isNew ? <SaveIcon role="presentation" /> : 'Aggiungi'}
          </button>
          {!isNew && (
            <button
              formAction={() => teamDeleteAction(id)}
              title={`Rimuovi ${name}`}
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
