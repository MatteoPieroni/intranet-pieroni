import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

interface IIconProps {
  icon: IconProp;
}

const Icon: React.FC<IIconProps> = ({ icon }) => (
  <FontAwesomeIcon icon={icon} />
);

export const ArrowRight: React.FC = () => (
  <Icon icon={faArrowRight} />
);