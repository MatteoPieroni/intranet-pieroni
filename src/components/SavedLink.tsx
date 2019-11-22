import React, { useState } from 'react';
import styled from '@emotion/styled';

import { ILink, EColor } from '../services/firebase/types';
import { Icon } from './icons';
import { getLightColor } from '../common/styles';
import { LinksForm } from './forms';

interface ISavedLinkProps {
  link: ILink;
  editable: boolean;
}

interface ITheme {
  color: EColor;
}

const StyledLink: React.FC<ITheme> = styled.li`
  display: block;
  border: 1px solid #ddd;
  border-left: 5px solid;
  border-left-color: #${(props: ITheme): string => props.color ? getLightColor(props.color) : '000'};
  background: #fff;
  
  a {
    position: relative;
    display: inline-block;
    padding: 1rem 1.5rem;
    width: 100%;
    font-weight: 900;
    letter-spacing: 1px;
    color: #333;
    text-transform: uppercase;
    text-decoration: none;
    overflow: hidden;

    &:after {
      content: "";
      position: absolute;
      bottom: 0.5rem;
      left: 1.5rem;
      background: #333;
      width: 0;
      height: .2rem;
      transition: all .25s ease-in-out;
    }

    &:hover {
      &:after {
        width: 50%;
      }
    }

    &.editing {
      padding: 1rem .5rem 0;

      &:hover:after {
        width: 0;
      }
    }
  }

  .arrow {
    float: right;
    margin-left: 1rem;
  }
`;

export const SavedLink: React.FC<ISavedLinkProps> = ({ link, editable }) => {
  const { link: url, description, color } = link;

  return (
    <StyledLink color={color}>
      <a href={!editable ? url : null} target="_blank" rel="noopener noreferrer" className={editable ? 'editing' : ''}>
        {description}
        {!editable && (
          <Icon.ArrowRight className="arrow" />
        )}
      </a>
      {editable && (
        <LinksForm initialState={link} onSave={(): void => null} />
      )}
    </StyledLink>
  );
};
