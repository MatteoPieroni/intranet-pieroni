import React, { useState } from 'react';
import styled from '@emotion/styled';

import { EColor } from '../services/firebase/types';
import { getLightColor } from '../common/styles';
import { LinksForm } from './forms';

interface ITheme {
  color?: EColor;
}

const StyledLink: React.FC<ITheme> = styled.li`
  display: block;
  border: 1px solid #ddd;
  border-left: 5px solid;
  border-left-color: #${(props: ITheme): string => props.color ? getLightColor(props.color) : '000'};
  background: #fff;

  .title {
    position: relative;
    display: inline-block;
    padding: .5rem .5rem 0 .5rem;
    width: 100%;
    font-weight: 900;
    letter-spacing: 1px;
    color: #333;
    text-transform: uppercase;
    text-decoration: none;
    overflow: hidden;
  }
`;

export const NewLink: React.FC = () => {
  return (
    <StyledLink>
      <p className="title">Aggiungi link</p>
      <LinksForm onSave={(): void => null} />
    </StyledLink>
  );
};
