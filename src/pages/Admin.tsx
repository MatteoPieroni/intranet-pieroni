import React, { Fragment } from 'react';

import { useLinks } from '../shared/hooks/useLinks';
import { Links } from '../components/links/links';
import { LinksForm, QuoteForm } from '../components/forms';
import { Quote } from '../components/quote/quote';
import { useQuote } from '../shared/hooks/useQuote';

export const Admin: React.FC = () => {
  const links = useLinks();
  const quote = useQuote();

  return (
    <>
    </>
  );
};
