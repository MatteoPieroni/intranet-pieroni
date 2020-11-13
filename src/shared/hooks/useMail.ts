import { useEffect, useState } from 'react';

import { IMail } from '../../services/firebase/types';
import { getMail } from '../../services/firebase/db';

export const useMail: () => [IMail, boolean] = () => {
  const [mail, setMail] = useState('' as IMail);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const fetchMail = async (): Promise<void> => {
      setLoading(true);

      try {
        const dbMail = await getMail();
        if (dbMail) {
          setMail(dbMail);
        }
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    };

    fetchMail();
  }, []);

  return [mail, loading];
} 