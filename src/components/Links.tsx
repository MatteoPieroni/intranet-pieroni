import React from 'react';
import { ILink } from '../services/firebase/types';
import { SavedLink } from './SavedLink';

interface ILinkProps {
  links: ILink[];
}

export const Links: React.FC<ILinkProps> = ({ links }) => (
  <ul>
    {links && links.map(link => (
      <SavedLink key={link.id} link={link} />
    ))
    }
  </ul>
);
