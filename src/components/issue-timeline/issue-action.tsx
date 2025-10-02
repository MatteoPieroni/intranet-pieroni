'use client';

import { useState } from 'react';

import styles from './issue-action.module.css';
import { IIssueAction } from '@/services/firebase/db-types';
import { IssueTimelineForm } from './issue-timeline-form';
import { DateComponent } from '../date/date';

type IssueActionProps = {
  issueId: string;
  action: IIssueAction;
  readOnly: boolean;
};

export const IssueAction = ({
  issueId,
  action,
  readOnly,
}: IssueActionProps) => {
  const { content, date, attachments, result } = action;

  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      {/* {!readOnly && (
        <button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Annulla modifiche' : 'Modifica'}
        </button>
      )} */}
      {!isEditing && (
        <>
          <p className={styles.dateContainer}>
            <DateComponent date={date} />
          </p>
          <div className={styles.content}>
            <p>
              <strong>Azione</strong>
            </p>
            <p>{content}</p>
          </div>
          {result && (
            <div className={styles.result}>
              <p>
                <strong>Risultato</strong>
              </p>
              <p>{result}</p>
            </div>
          )}
          <div className={styles.attachments}></div>
        </>
      )}
      {isEditing && !readOnly && (
        <IssueTimelineForm action={action} issueId={issueId} />
      )}
    </>
  );
};
