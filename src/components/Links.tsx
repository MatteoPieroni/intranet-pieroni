import React from 'react';

import { ILink } from '../services/firebase/types';
import { SavedLink } from './SavedLink';

import { updateLink } from '../services/firebase/db';

interface ILinkProps {
  links: ILink[];
  editable?: boolean;
}

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
    <ul>
      {links && links.map(link => (
        <SavedLink key={link.id} link={link} editable={editable} editLink={editLink} />
      ))}
    </ul>
  )
};
