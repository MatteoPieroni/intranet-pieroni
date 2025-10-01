'use client';

import { IIssueAction } from '@/services/firebase/db-types';
import { formatDate } from '@/utils/formatDate';
import { useState } from 'react';
import { IssueTimelineForm } from './issue-timeline-form';

type IssueActionProps = { issueId: string; action: IIssueAction };

export const IssueAction = ({ issueId, action }: IssueActionProps) => {
  const { content, date, attachments, result } = action;

  const [isEditing, setIsEditing] = useState(false);

  return (
    <div>
      <button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? 'Annulla modifiche' : 'Modifica'}
      </button>
      {!isEditing && (
        <>
          <p>{formatDate(date)}</p>
          <p>{content}</p>
          {result && <p>{result}</p>}
        </>
      )}
      {isEditing && <IssueTimelineForm action={action} issueId={issueId} />}
    </div>
  );
};
