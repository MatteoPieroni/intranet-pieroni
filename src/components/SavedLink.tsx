import React from 'react';
import { ILink } from '../services/firebase/types';

interface ISavedLinkProps {
  link: ILink;
}

export const SavedLink: React.FC<ISavedLinkProps> = ({ link }) => {

  const { link: url, description, color } = link;

  return (
    <li>
      <a href={url} target="_blank" rel="noopener noreferrer">
        {description}
      </a>
    </li>
  );
};
