import React from 'react';
import Modal from 'react-modal';
import styled from '@emotion/styled';

import { IImage } from '../../services/firebase/db';
import { RadioImages } from '../form-fields/radio-images';

interface IImagesModalProps {
  isOpen: boolean;
  closeModal: () => void;
  className?: string;
  contentLabel?: string;
  images: IImage[];
  onSelect?: (selectedImage?: string) => void;
}

Modal.setAppElement('#app');

const StyledDiv = styled.div`
  img {
    max-width: 100%;
  }

  .radio-images__container {
    display: flex;
    flex-wrap: wrap;

    .image {
      padding: 1rem;
      max-width: 25%;
    }
  }

  .radio-images__label {
    width: 100%;
  }
`;

export const ImagesModal: React.FC<IImagesModalProps> = ({ isOpen, className, contentLabel = null, closeModal, images, onSelect }) => {

  if (images.length === 0) {
    return null;
  }

  const handleSelect: () => void = () => {
    typeof onSelect === 'function' && onSelect();
    closeModal();
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      className={className ? `modal ${className}` : 'modal'}
      contentLabel={contentLabel}
    >
      <StyledDiv>
        <RadioImages images={images} name="url" label="Immagine" onSelect={handleSelect} />
      </StyledDiv>
    </Modal>
  )
}
