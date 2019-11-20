import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faArrowRight, faPen } from '@fortawesome/free-solid-svg-icons'

interface IIconProps {
  icon: IconProp;
  color?: string;
  rest?: IGenericProps;
}

const Icon: React.FC<IIconProps> = ({ icon, color, ...rest }) => (
  <FontAwesomeIcon icon={icon} color={color} {...rest} />
);

export const ArrowRight: React.FC<IGenericProps> = (props) => (
  <Icon icon={faArrowRight} {...props} />
);

export const Pencil: React.FC<IGenericProps> = (props) => (
  <Icon icon={faPen} {...props} />
)