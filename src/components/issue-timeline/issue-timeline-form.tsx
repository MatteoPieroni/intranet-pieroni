'use client';

import { useActionState } from 'react';
import * as z from 'zod';

import { IIssueAction } from '@/services/firebase/db-types';
import { issueAction, StateValidation } from './issue-timeline-action';
import styles from './issue-timeline-form.module.css';
import { FormStatus } from '../form-status/form-status';

type IssueFormProps = {
  issueId: string;
} & (
  | {
      action: IIssueAction;
      isNew?: false;
    }
  | {
      isNew: true;
      action: undefined;
    }
);

const initialState: StateValidation = {};

export const AttachmentSchema = z.file().max(1_000_000, 'Too big');

const emptyAction = {
  id: '',
  date: new Date(),
  content: '',
  result: '',
} satisfies IIssueAction;

export const IssueTimelineForm = ({
  issueId,
  action: { id, content, date, attachments, result } = emptyAction,
  isNew,
}: IssueFormProps) => {
  const actionWithIssueId = issueAction.bind(null, issueId);

  const [state, formAction, pending] = useActionState(
    actionWithIssueId,
    initialState
  );

  return (
    <form action={formAction}>
      <div className={styles.container}>
        <label>
          Data
          <input
            name="date"
            type="date"
            defaultValue={date.toISOString().split('T')[0]}
            required
          />
        </label>
        <label>
          Azione
          <textarea name="content" defaultValue={content} required />
        </label>
        <label>
          Allegati
          <input
            type="file"
            name="attachment"
            multiple
            defaultValue=""
            accept=".jpg,.png"
            onChange={(e) => {
              const files = e.target.files || [];
              const filesWithoutBig = new DataTransfer();
              let hasError = false;

              for (const file of files) {
                try {
                  AttachmentSchema.parse(file);

                  filesWithoutBig.items.add(file);
                } catch (error) {
                  console.error(error);
                  hasError = true;
                }
              }

              if (hasError) {
                alert('Uno dei file era troppo grande, lo abbiamo rimosso');
              }

              let total = 0;
              for (const finalFile of filesWithoutBig.files) {
                total += finalFile.size;
              }

              if (total > 1_000_000) {
                alert(
                  'Il totale di allegati e troppo grande, riducili o rimuovine alcuni'
                );
                e.target.value = '';
                return;
              }

              e.target.files = filesWithoutBig.files;
            }}
          />
        </label>
        <label>
          Risultato
          <textarea name="result" defaultValue={result} />
        </label>
      </div>

      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="isNew" value={isNew ? 'NEW' : ''} />
      <div className={styles.buttonsContainer}>
        <button type="submit" title={!isNew ? 'Salva' : 'Aggiungi'}>
          {!isNew ? 'Salva' : 'Aggiungi'}
        </button>
      </div>
      {!pending && <FormStatus text={state.success} type="success" />}
      {!pending && <FormStatus text={state.error} type="error" />}
    </form>
  );
};
