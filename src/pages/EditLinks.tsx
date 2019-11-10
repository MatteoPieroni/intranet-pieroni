import React, { Fragment } from 'react';

import { useLinks } from '../shared/hooks/useLinks';
import { Links } from '../components/Links';

export const EditLinks: React.FC = () => {
  const links = useLinks();

  return (
    <>
      <div>Links</div>
      {links && <Links links={links} />}
    </>
  );
};
