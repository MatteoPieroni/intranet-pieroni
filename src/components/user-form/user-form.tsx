'use client';

import { ITeam, IUser } from '@/services/firebase/db-types';
import styles from './user-form.module.css';
import { SaveIcon } from '../icons/save';

type UserFormProps = {
  user: IUser;
  availableTeams: ITeam[];
};

export const UserForm = ({
  user: { name, surname, email, id, teams },
  availableTeams,
}: UserFormProps) => {
  // const [state, formAction, pending] = useActionState(linkAction, initialState);
  return (
    <form>
      <div className={styles.container}>
        <label>
          Nome
          <input name="name" defaultValue={`${name} ${surname}`} readOnly />
        </label>
        <label>
          Mail
          <input type="email" name="email" defaultValue={email} readOnly />
        </label>
        <label>
          Teams
          <select name="teams" multiple>
            {availableTeams.map((team) => (
              <option
                value={team.id}
                key={team.id}
                selected={teams?.some((current) => current === team.id)}
              >
                {team.name}
              </option>
            ))}
          </select>
        </label>
        <input type="hidden" name="id" value={id} />
        <div className={styles.buttonsContainer}>
          <button type="submit" title="Salva">
            <SaveIcon role="presentation" />
          </button>
        </div>
      </div>
      {/* {!pending && <FormStatus text={state.success} type="success" />}
      {!pending && <FormStatus text={state.error} type="error" />} */}
    </form>
  );
};
