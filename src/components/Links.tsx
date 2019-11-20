import React, { useState } from 'react';
import styled from '@emotion/styled';

import { ILink } from '../services/firebase/types';
import { SavedLink } from './SavedLink';
import { StyledH2 } from './styled';

import { updateLink } from '../services/firebase/db';
import { Icon } from './icons';

interface ILinkProps {
  links: ILink[];
}

const StyledLinks = styled.ul`
  .header {
    display: flex;
    justify-content: space-between;
  }

  .icon {
    width: 2rem;
    text-align: center;
    padding-top: .25rem;
  }

  ul {
    padding: 1rem 0;
    columns: 2;
  }

  li {
    margin-bottom: .5rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export const Links: React.FC<ILinkProps> = ({ links }) => {
  const [isEditing, setIsEditing] = useState(false);

  const editLink: (link: ILink) => void = async (link) => {
    const { id, link: linkUrl, description, color } = link;

    try {
      // await updateLink(id, link)
      console.log('editing', link)
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <StyledLinks>
      <div className="header">
        <StyledH2>Link utili</StyledH2>
        <span className="icon" onClick={(): void => setIsEditing(!isEditing)}>
          <Icon.Pencil color="#fff" />
        </span>
      </div>
      <ul>
        {links && links.map(link => (
          <SavedLink key={link.id} link={link} editable={isEditing} editLink={editLink} />
        ))}
      </ul>
    </StyledLinks>
  )
};
