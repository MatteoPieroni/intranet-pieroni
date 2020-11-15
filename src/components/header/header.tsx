import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from '@emotion/styled';

import { useMail, useUser } from '../../shared/hooks';
import { Logo } from '../logo';

const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: .5rem 1rem;
  background: #24305E;

  .logo-container {
    height: 2rem;
  }

  a, .log-out {
    padding: 0 1rem 0 0;
    font-size: 1rem;
    line-height: 1rem;
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

  .log-out {
    padding-left: 2rem;
    background: none;
    cursor: pointer;
  }
`;

export const Header: () => JSX.Element = () => {

  const [, , logout] = useUser();
  const [mail, loadingMail] = useMail();

  return (
    <StyledHeader>
      <nav>
        <NavLink to="/home">
          Home
        </NavLink>
        {!loadingMail && (
          <a href={mail} target="_blank" rel="noopener noreferrer">
            Mail
          </a>
        )}
        <NavLink to="/sms">
          Sms
        </NavLink>
        <NavLink to="/maps">
          Costo trasporti
        </NavLink>
        <NavLink to="/cartello">
          Crea cartello
        </NavLink>
        <button className="log-out" onClick={logout}>Esci</button>
      </nav>
      <div className="logo-container">
        <Logo />
      </div>
    </StyledHeader>
  );
};
