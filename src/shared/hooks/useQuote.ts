import { useEffect, useState } from 'react';

import { getQuote, IQuote } from '../../services/firebase/db';

export const useQuote: () => [IQuote, () => void, boolean] = () => {
  const [quote, setQuote] = useState({} as IQuote);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [loading, setLoading] = useState(false);

  const refreshQuote = (): void => setShouldRefresh(true);

  useEffect(() => {

    const fetchQuote = async (): Promise<void> => {
      setLoading(true);

      try {
        const dbQuote = await getQuote();
        if (dbQuote) {
          setQuote(dbQuote);
        }
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    };

    fetchQuote();
    setShouldRefresh(false);
  }, [shouldRefresh]);

  return [quote, refreshQuote, loading];
} 