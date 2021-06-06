import React from 'react';
import styled from '@emotion/styled';
import { SerializedStyles, css } from '@emotion/core';

enum EButtonType {
  submit = 'submit',
  button = 'button'
}

interface IButtonProps {
  icon?: React.FC<{ className: string }>;
  children: string;
  ghost?: boolean;
  type?: keyof typeof EButtonType;
  className?: string;
  testId?: string;
  onClick?: (event: React.MouseEvent) => void;
  disabled?: boolean;
  isExpanding?: boolean;
}

interface IButtonStyleProps {
  ghost?: boolean;
  isExpanding?: boolean;
}

const StyledButton = styled.button<IButtonStyleProps>`
  border: none;
  border-radius: 2.5px;
  padding: .5px;
  background: transparent;

  .button {
    display: block;
    border-bottom: ${(props): string => props.ghost ? '2px solid #F13C20' : 'none'};
    border-radius: 2.5px;
    padding: .5rem 1rem;
    background: ${(props): string => props.ghost ? 'none' : '#F13C20'};
    color: ${(props): string => props.ghost ? '#F13C20' : '#FFF'};
  }

  &:hover {
    .button {
      background: #ca2b12;
      color: #FFF;
    }
  }

  &:focus {
    outline: 2px solid #D79922;
  }

  &:disabled .button {
    background: grey;
  }

  .text {
    font-weight: bold;
  }

  .button-icon {
    margin-right: .5rem;
    fill: #FFF;
  }

  ${(props): SerializedStyles => props.isExpanding && css`
  .button-icon {
      margin-right: 0;
    }

    .text {
      display: inline-block;
      width: auto;
      max-width: 0;
      overflow: hidden;
      white-space: nowrap;
      transition: all .3s ease-in-out;
      vertical-align: middle;
    }

    &:hover, &:focus {
      .button-icon {
        margin-right: .5rem;
      }

      .text {
        max-width: 150px;
      }
    }
  `}
`;

export const Button: React.FC<IButtonProps> = ({ className, icon: Icon, children, ghost, onClick, type = 'button', testId = '', disabled, isExpanding }) => {
  if (isExpanding && !Icon) {
    throw new Error('To have an expanding button you need an icon');
  }

  return (
    <StyledButton ghost={ghost} onClick={onClick} type={type} className={className} data-testid={testId} disabled={disabled} isExpanding={isExpanding}>
      <span className="button">
        {Icon && <Icon className="button-icon" />}
        <span className="text">{children}</span>
      </span>
    </StyledButton>
  )
}
