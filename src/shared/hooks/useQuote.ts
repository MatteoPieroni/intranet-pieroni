import { useEffect, useState } from 'react';

import { IQuote } from '../../services/firebase/types';
import { getQuote } from '../../services/firebase/db';

export const useQuote: () => IQuote = () => {
  const [quote, setQuote] = useState({} as IQuote);

  useEffect(() => {
    const fetchQuote = async (): Promise<void> => {
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

  return quote;
} 