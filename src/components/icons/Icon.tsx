import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faArrowRight, faPen, faTrash } from '@fortawesome/free-solid-svg-icons'

export interface IIconProps {
  icon: IconProp;
  color?: string;
  className?: string;
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

export const Trash: React.FC<IGenericProps> = (props) => (
  <Icon icon={faTrash} {...props} />
)