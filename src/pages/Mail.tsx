import React from 'react';
import styled from '@emotion/styled';

import { MailFrame } from '../components/mail-frame';
import { useMail } from '../shared/hooks';
import { Loader } from '../components';

const StyledPage = styled.main`
  padding: 1rem;
  height: 100%;
`;

export const Mail: React.FC = () => {
  const [mail, loadingMail] = useMail();

  return (
    !loadingMail ? (
      <StyledPage>
        <MailFrame mail={mail} />
      </StyledPage>
    ) : <Loader />
  )
}

export default Mail;