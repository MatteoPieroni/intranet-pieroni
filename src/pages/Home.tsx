import React from 'react';


import { Quote } from '../components/Quote';
import { Links } from '../components/Links';
import { WelcomeMessage } from '../components/WelcomeMessage';
import { useLinks } from '../shared/hooks/useLinks';
import { useQuote } from '../shared/hooks/useQuote';

export const Home: () => JSX.Element = () => {
  const links = useLinks();
  const quote = useQuote();

  return (
    <main>
      <h1>
        Home
      </h1>
      <WelcomeMessage />
      {links && <Links links={links} />}
      {quote && <Quote source={quote.url} text={quote.text} />}
    </main>
  );
};
