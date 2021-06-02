import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowRight,
  faPen,
  faTrash,
  faInfoCircle,
  faFilePdf,
  faFolder,
  faCaretRight,
  faCaretDown,
  faCheck,
  faSearch,
  faTh,
  faList,
  faSync,
  faUpload,
} from '@fortawesome/free-solid-svg-icons'

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

export const InfoCircle: React.FC<IGenericProps> = (props) => (
  <Icon icon={faInfoCircle} {...props} />
)

export const PDFFile: React.FC<IGenericProps> = (props) => (
  <Icon icon={faFilePdf} {...props} />
)

export const Folder: React.FC<IGenericProps> = (props) => (
  <Icon icon={faFolder} {...props} />
)

export const CaretRight: React.FC<IGenericProps> = (props) => (
  <Icon icon={faCaretRight} {...props} />
)

export const CaretDown: React.FC<IGenericProps> = (props) => (
  <Icon icon={faCaretDown} {...props} />
)

export const CheckboxCheckedIcon: React.FC<IGenericProps> = (props) => (
  <Icon icon={faCheck} {...props} />
)

export const SearchIcon: React.FC<IGenericProps> = (props) => (
  <Icon icon={faSearch} {...props} />
)

export const GridIcon: React.FC<IGenericProps> = (props) => (
  <Icon icon={faTh} {...props} />
)

export const ListIcon: React.FC<IGenericProps> = (props) => (
  <Icon icon={faList} {...props} />
)

export const SyncIcon: React.FC<IGenericProps> = (props) => (
  <Icon icon={faSync} {...props} />
)

export const UploadIcon: React.FC<IGenericProps> = (props) => (
  <Icon icon={faUpload} {...props} />
)
