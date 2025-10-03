'use client';

import { useRef, useState } from 'react';

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
  const editButtonRef = useRef<HTMLButtonElement>(null);

  const onEditSuccess = () => {
    setIsEditing(false);
    editButtonRef.current?.focus();
  };

  return (
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
      <div className={styles.attachments}>
        {attachments && attachments?.length !== 0 && (
          <>
            <p>
              <strong>Allegati</strong>
            </p>
            <div className={styles.attachmentsContainer}>
              {attachments.map((attachment) => (
                <a href={attachment} target="__blank" key={attachment}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={attachment} alt="" />
                </a>
              ))}
            </div>
          </>
        )}
      </div>
      {!readOnly && (
        <div className={styles.editContainer}>
          <button onClick={() => setIsEditing(!isEditing)} ref={editButtonRef}>
            {isEditing ? 'Annulla modifiche' : 'Modifica'}
          </button>

          {isEditing && (
            <IssueTimelineForm
              action={action}
              issueId={issueId}
              onSuccess={onEditSuccess}
            />
          )}
        </div>
      )}
    </>
  );
};
