import React from 'react';
import styled from '@emotion/styled';
import { SmsForm } from '../components/forms';

const StyledPage = styled.main`

`;

export const Sms: React.FC = () => {
  return (
    <StyledPage>
      <SmsForm />
    </StyledPage>
  )
}
