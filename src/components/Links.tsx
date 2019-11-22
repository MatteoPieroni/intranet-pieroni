import React, { useState } from 'react';
import styled from '@emotion/styled';

import { ILink } from '../services/firebase/types';
import { SavedLink } from './SavedLink';
import { StyledH2 } from './styled';

import { updateLink } from '../services/firebase/db';
import { Icon } from './icons';
import { NewLink } from './NewLink';
import { Button } from './button';

interface ILinkProps {
  links: ILink[];
}

const StyledLinks = styled.div`
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .links-button .button {
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

  return (
    <StyledLinks>
      <div className="header">
        <StyledH2>Link utili</StyledH2>
        <Button icon={Icon.Pencil} ghost className="links-button" onClick={(): void => setIsEditing(!isEditing)}>
          Modifica
        </Button>
      </div>
      <ul>
        {links && links.map(link => (
          <SavedLink key={link.id} link={link} editable={isEditing} />
        ))}
        {isEditing && <NewLink />}
      </ul>
    </StyledLinks>
  )
};
