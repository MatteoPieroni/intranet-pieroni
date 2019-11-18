import React from 'react';
import styled from '@emotion/styled';

import { ILink } from '../services/firebase/types';
import { SavedLink } from './SavedLink';

import { updateLink } from '../services/firebase/db';

interface ILinkProps {
  links: ILink[];
  editable?: boolean;
}

const StyledH2 = styled.h2`
  font-size: 1.5rem;
  color: #FFF;
  text-transform: uppercase;
`;

const StyledLinksList = styled.ul`
  padding: 1rem 0;
  columns: 2;

  li {
    margin-bottom: .5rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export const Links: React.FC<ILinkProps> = ({ links, editable = false }) => {
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
    <>
      <StyledH2>Link utili</StyledH2>
      <StyledLinksList>
        {links && links.map(link => (
          <SavedLink key={link.id} link={link} editable={editable} editLink={editLink} />
        ))}
      </StyledLinksList>
    </>
  )
};
