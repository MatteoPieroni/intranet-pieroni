import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from '@emotion/styled';

import { useUser } from '../shared/hooks/useUser';
import { Logo } from './Logo';

const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: .5rem 1rem;
  background: #24305E;

  .logo-container {
    height: 2rem;
  }

  a {
    padding: 0 1rem 0 0;
    color: #fff;
    font-weight: 600;
    vertical-align: middle;
    text-decoration: none;
    text-transform: uppercase;

    &:hover {
      text-decoration: underline;
    }

    &.active {
      color: #f23c20;
    }
  }
`;

export const Header: () => JSX.Element = () => {

  const [, , logout] = useUser();

  return (
    <StyledHeader>
      <nav>
        <NavLink to="/home">
          Home
        </NavLink>
        <NavLink to="/sms">
          Sms
        </NavLink>
        <NavLink to="/maps">
          Costo trasporti
        </NavLink>
        <button onClick={logout}>Log out</button>
      </nav>
      <div className="logo-container">
        <Logo />
      </div>
    </StyledHeader>
  );
};
