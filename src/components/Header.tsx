import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from '@emotion/styled';

import { useUser } from '../shared/hooks/useUser';
import { Logo } from './Logo';

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  padding: .5rem 1rem;
  background: #24305E;

  .logo-container {
    height: 2rem;
  }
`;

export const Header: () => JSX.Element = () => {

  const [, , logout] = useUser();

  return (
    <StyledHeader>
      <nav>
        <NavLink to="/sms">
          Sms
        </NavLink>
        <button onClick={logout}>Log out</button>
      </nav>
      <div className="logo-container">
        <Logo />
      </div>
    </StyledHeader>
  );
};
