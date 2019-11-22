import React from 'react';
import styled from '@emotion/styled';
import { IIconProps } from '../icons/Icon';

enum EButtonType {
  submit = 'submit',
  button = 'button'
}

interface IButtonProps {
  icon?: React.FC<{ className: string }>;
  children: string;
  ghost?: boolean;
  type?: EButtonType | keyof typeof EButtonType;
  className?: string;
  onClick?: (event: React.MouseEvent) => void;
}

interface IButtonStyleProps {
  ghost?: boolean;
}

const StyledButton = styled.button<IButtonStyleProps>`
  border: none;
  border-radius: 2.5px;
  padding: .5px;
  background: transparent;
  cursor: pointer;

  .button {
    display: block;
    border-bottom: ${props => props.ghost ? '2px solid #F13C20' : 'none'};
    border-radius: 2.5px;
    padding: .5rem 1rem;
    background: ${props => props.ghost ? 'none' : '#F13C20'};
    color: ${props => props.ghost ? '#F13C20' : '#FFF'};
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

  .text {
    font-weight: bold;
  }

  .button-icon {
    margin-right: .5rem;
    fill: #FFF;
  }
`;

export const Button: React.FC<IButtonProps> = ({ className, icon: Icon, children, ghost, onClick, type = 'button' }) => {
  return (
    <StyledButton ghost={ghost} onClick={onClick} type={type} className={className}>
      <span className="button">
        {Icon && <Icon className="button-icon" />}
        <span className="text">{children}</span>
      </span>
    </StyledButton>
  )
}
