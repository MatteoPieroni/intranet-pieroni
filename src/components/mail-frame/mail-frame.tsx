import React from 'react';
import styled from '@emotion/styled';

export interface MailFrameProps {
  mail: string;
}

const StyledFrameContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 6rem);

  iframe {
    flex: 1;
    width: 100%;
  }
`;

export const MailFrame: React.FC<MailFrameProps> = ({ mail }) => {
  return (
    <StyledFrameContainer>
        <h1>Leggi la tua mail</h1>
        <iframe src={mail} />
    </StyledFrameContainer>
  );
};
