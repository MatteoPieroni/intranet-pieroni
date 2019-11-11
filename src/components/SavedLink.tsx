import React from 'react';
import { ILink } from '../services/firebase/types';

interface ISavedLinkProps {
  link: ILink;
  editable: boolean;
  editLink: (link: ILink) => void;
}

export const SavedLink: React.FC<ISavedLinkProps> = ({ link, editable, editLink }) => {
  const { link: url, description, color } = link;

  const handleClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void = (e) => {
    event.preventDefault();
    editLink(link);
  };

  return (
    <li>
      <a href={!editable ? url : ''} target="_blank" rel="noopener noreferrer" onClick={editable ? handleClick : null}>
        {description}
      </a>
    </li>
  );
};
