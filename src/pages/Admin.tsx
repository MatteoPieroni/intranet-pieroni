import React, { Fragment } from 'react';

import { useLinks } from '../shared/hooks/useLinks';
import { Links } from '../components/Links';
import { LinksForm, QuoteForm } from '../components/forms';
import { Quote } from '../components/Quote';
import { useQuote } from '../shared/hooks/useQuote';

export const Admin: React.FC = () => {
  const links = useLinks();
  const quote = useQuote();

  return (
    <>
      <div>Links</div>
      <LinksForm onSave={() => null} />
      {links && <Links links={links} />}
      <QuoteForm />
      {quote && <Quote source={quote.url} text={quote.text} />}
    </>
  );
};
