import { useEffect, useState } from 'react';

import { listenToLinks } from '../../services/firebase/db';
import { ILink } from '../../services/firebase/types';

export const useLinks: () => ILink[] = () => {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const unListenToLinks = listenToLinks((hasError, dbLinks) => {
      if (!hasError) {
        setLinks(dbLinks);
      }
    });

    return unListenToLinks;
  }, []);

  return links;
}