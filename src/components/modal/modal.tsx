import React from 'react';
import ExternalModal from 'react-modal';

export interface IModalProps {
  isOpen: boolean;
  closeModal: () => void;
  className?: string;
  contentLabel?: string;
}

ExternalModal.setAppElement('#app');

export const Modal: React.FC<IModalProps> = ({ isOpen, className, contentLabel = null, closeModal, children }) => {

  return (
    <ExternalModal
      isOpen={isOpen}
      onRequestClose={closeModal}
      className={className ? `modal ${className}` : 'modal'}
      contentLabel={contentLabel}
    >
      {children}
    </ExternalModal>
  )
}
