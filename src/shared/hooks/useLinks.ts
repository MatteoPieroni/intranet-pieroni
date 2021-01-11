import { useEffect, useState } from 'react';

import { listenToLinks, ILink } from '../../services/firebase/db';

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