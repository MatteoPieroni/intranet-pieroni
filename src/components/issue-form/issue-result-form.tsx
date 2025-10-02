'use client';

import { useActionState } from 'react';

import { issueResultAction, StateValidation } from './issue-result-action';
import styles from './issue-form.module.css';
import { FormStatus } from '../form-status/form-status';

type IssueFormProps = {
  id: string;
};

const initialState: StateValidation = {
  error: '',
  success: '',
};

export const IssueResultForm = ({ id }: IssueFormProps) => {
  const [state, formAction, pending] = useActionState(
    issueResultAction,
    initialState
  );

  return (
    <form action={formAction}>
      <div className={styles.container}>
        <div className={styles.row}>
          <label>
            Risultato
            <textarea name="summary" required />
          </label>
        </div>

        <input type="hidden" name="id" value={id} />
        <div className={styles.buttonsContainer}>
          <button type="submit">Salva</button>
        </div>
      </div>
      {!pending && <FormStatus text={state.success} type="success" />}
      {!pending && <FormStatus text={state.error} type="error" />}
    </form>
  );
};
