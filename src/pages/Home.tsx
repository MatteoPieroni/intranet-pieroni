import React, { useState, useEffect } from 'react';

import { ILink, IQuote } from '../services/firebase/types';

import { listenToLinks, getQuote } from '../services/firebase/db';
import { Quote } from '../components/Quote';
import { Links } from '../components/Links';
import { WelcomeMessage } from '../components/WelcomeMessage';

export const Home: () => JSX.Element = () => {
  const [links, setLinks] = useState([] as ILink[]);
  const [quote, setQuote] = useState({} as IQuote);

  useEffect(() => {
    const unListenToLinks = listenToLinks((hasError, dbLinks) => {
      if (!hasError) {
        setLinks(dbLinks);
      }
    });

    return unListenToLinks;
  }, []);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const dbQuote = await getQuote();
        if (dbQuote) {
          setQuote(dbQuote);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchQuote();
  }, []);

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
