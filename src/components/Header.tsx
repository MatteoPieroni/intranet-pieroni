import React from 'react';
import { useUser } from '../shared/hooks/useUser';

interface IHeaderProps {

}

export const Header: (props: IHeaderProps) => JSX.Element = () => {

  const [, , logout] = useUser();

  return (
    <div>
      <button onClick={logout}>Log out</button>
    </div>
  );
};
