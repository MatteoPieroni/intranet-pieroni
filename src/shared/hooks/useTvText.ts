import { useEffect, useState } from 'react';

import { getTvText, ITv } from '../../services/firebase/db';

export const useTvText: () => [ITv, () => void, boolean] = () => {
  const [text, setText] = useState<ITv>({ text: '' });
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [loading, setLoading] = useState(false);

  const refreshTvText = (): void => setShouldRefresh(true);

  useEffect(() => {
    const fetchTvText = async (): Promise<void> => {
      setLoading(true);

      try {
        const dbText = await getTvText();
        if (dbText) {
          setText(dbText);
        }
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    };

    fetchTvText();
    setShouldRefresh(false);
  }, [shouldRefresh]);

  return [text, refreshTvText, loading];
};
