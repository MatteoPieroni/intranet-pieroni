import React, { useState } from 'react';
import styled from '@emotion/styled';

import { ILink } from '../../services/firebase/db';
import { SavedLink } from '../saved-link/saved-link';
import { StyledH2 } from '../styled';

import { Icon } from '../icons';
import { NewLink } from '../new-link';
import { Button } from '../button';
import { useUser } from '../../shared/hooks';

interface ILinkProps {
  links: ILink[];
}

const StyledLinks = styled.div`
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .form-button .button {
    border-bottom-color: #FFF;
    color: #FFF;
  }

  ul {
    padding: 1rem 0;
    columns: 2;
  }

  li {
    margin-bottom: .5rem;
    -webkit-column-break-inside: avoid;
    page-break-inside: avoid;
    break-inside: avoid;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export const Links: React.FC<ILinkProps> = ({ links }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [user] = useUser();
  const { isAdmin } = user;

  return (
    <StyledLinks>
      <div className="header">
        <StyledH2 data-testid="links-title">Link utili</StyledH2>
        {isAdmin && (
          <Button icon={Icon.Pencil} ghost className="form-button" onClick={(): void => setIsEditing(!isEditing)}>
            Modifica
          </Button>
        )}
      </div>
      <ul>
        {links && links.map(link => (
          <SavedLink key={link.id} link={link} editable={isAdmin && isEditing} />
        ))}
        {isAdmin && isEditing && <NewLink />}
      </ul>
    </StyledLinks>
  )
};
