import React, { useState, useEffect } from 'react';

import { ILink, IQuote } from '../services/firebase/types';

import { listenToLinks, getQuote } from '../services/firebase/db';

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

  console.log('links', { links });
  console.log('quote', { quote });

  return (
    <main>
      <h1>
        Home
      </h1>
      {links && links.map(link => link.id)}
    </main>
  );
};
