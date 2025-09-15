'use client';

import { useActionState } from 'react';

import { ITeam, IUser } from '@/services/firebase/db-types';
import styles from './user-form.module.css';
import { SaveIcon } from '../icons/save';
import { MultiSelect } from '../multiselect/multiselect';
import { StateValidation, userAction } from './user-action';
import { FormStatus } from '../form-status/form-status';

type UserFormProps = {
  user: IUser;
  availableTeams: ITeam[];
};

const initialState: StateValidation = {};

export const UserForm = ({
  user: { name, surname, email, id, teams, ...rest },
  availableTeams,
}: UserFormProps) => {
  const userActionWithPrevious = userAction.bind(null, {
    name,
    surname,
    email,
    id,
    ...rest,
  });

  const [state, formAction, pending] = useActionState(
    userActionWithPrevious,
    initialState
  );

  const selectTeams = availableTeams.map((team) => ({
    value: team.id,
    label: team.name,
    isDefaultChecked: !!teams?.some((current) => current === team.id),
  }));

  return (
    <form action={formAction}>
      <div className={styles.container}>
        <label>
          Nome
          <input name="name" defaultValue={`${name} ${surname}`} readOnly />
        </label>
        <label>
          Mail
          <input type="email" name="email" defaultValue={email} readOnly />
        </label>
        <div className={styles.selectContainer}>
          <MultiSelect options={selectTeams} name="teams" />
        </div>
        <input type="hidden" name="id" value={id} />
        <div className={styles.buttonsContainer}>
          <button type="submit" title="Salva">
            <SaveIcon role="presentation" />
          </button>
        </div>
      </div>
      {!pending && <FormStatus text={state.success} type="success" />}
      {!pending && <FormStatus text={state.error} type="error" />}
    </form>
  );
};
