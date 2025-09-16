'use client';

import { useActionState } from 'react';

import type { ILink, ITeam } from '@/services/firebase/db-types';
import { linkAction, linkDeleteAction, StateValidation } from './link-action';
import styles from './link-form.module.css';
import { FormStatus } from '../form-status/form-status';
import { DeleteIcon } from '../icons/delete';
import { SaveIcon } from '../icons/save';
import { MultiSelect } from '../multiselect/multiselect';

type LinksFormProps = {
  link: ILink;
  isNew?: boolean;
  availableTeams: ITeam[];
};

const getFakeIcon = (name: string) => {
  const words = name.split(' ');
  const firstLetters = words.reduce((finalString, word) => {
    if (finalString.length === 2) {
      return finalString;
    }

    // skip small words
    if (word.length === 1) {
      return finalString;
    }

    return `${finalString}${word[0]}`;
  }, '');

  return firstLetters;
};

const initialState: StateValidation = {};

export const LinkForm = ({
  link: { description, link, id, teams, icon },
  isNew = false,
  availableTeams,
}: LinksFormProps) => {
  const [state, formAction, pending] = useActionState(linkAction, initialState);

  const selectTeams = availableTeams.map((team) => ({
    value: team.id,
    label: team.name,
    isDefaultChecked: !!teams?.some((current) => current === team.id),
  }));

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
        <div className={styles.selectContainer}>
          <MultiSelect options={selectTeams} name="teams" legend="Teams" />
        </div>
        <label className={styles.iconLabel}>
          Icona
          {!isNew && (
            <div className={styles.iconContainer}>
              {icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={icon} alt="" width={42} height={42} />
              ) : (
                <span>{getFakeIcon(description)}</span>
              )}
            </div>
          )}
          {/* add validation */}
          <input type="file" name="icon" />
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
