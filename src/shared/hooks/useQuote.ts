import { useEffect, useState } from 'react';

import { IQuote } from '../../services/firebase/types';
import { getQuote } from '../../services/firebase/db';

export const useQuote: () => [IQuote, () => void] = () => {
  const [quote, setQuote] = useState({} as IQuote);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  const refreshQuote = (): void => setShouldRefresh(true);

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
    setShouldRefresh(false);
  }, [shouldRefresh]);

  return [quote, refreshQuote];
} 