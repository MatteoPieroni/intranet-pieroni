import React from 'react';
import ExternalModal from 'react-modal';
import styled from '@emotion/styled';

interface IModalProps {
  isOpen: boolean;
  closeModal: () => void;
  className?: string;
  contentLabel?: string;
}

ExternalModal.setAppElement('#app');

const StyledDiv = styled.div`
`;

export const Modal: React.FC<IModalProps> = ({ isOpen, className, contentLabel = null, closeModal, children }) => {

  return (
    <ExternalModal
      isOpen={isOpen}
      onRequestClose={closeModal}
      className={className ? `modal ${className}` : 'modal'}
      contentLabel={contentLabel}
    >
      <StyledDiv>
        {children}
      </StyledDiv>
    </ExternalModal>
  )
}
