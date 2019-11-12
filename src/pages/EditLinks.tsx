import React, { Fragment } from 'react';

import { useLinks } from '../shared/hooks/useLinks';
import { Links } from '../components/Links';
import { LinksForm } from '../components/forms';

export const EditLinks: React.FC = () => {
  const links = useLinks();

  return (
    <>
      <div>Links</div>
      <LinksForm />
      {links && <Links links={links} editable />}
    </>
  );
};
