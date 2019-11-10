import React from 'react';
import { useUser } from '../shared/hooks/useUser';

export const Header: () => JSX.Element = () => {

  const [, , logout] = useUser();

  return (
    <div>
      <button onClick={logout}>Log out</button>
    </div>
  );
};
