import React from 'react';
import styled from '@emotion/styled';

enum EVariants {
  success = 'success',
  fail = 'fail'
}

interface INotificationProps {
  message: string;
  variant?: keyof typeof EVariants;
}

const colors = {
  success: {
    text: '#116114',
    background: 'rgba(55, 133, 57, 0.36)',
  },
  fail: {
    text: '#9e1500',
    background: 'rgba(241, 60, 32, 0.36)',
  }
}

const StyledDiv = styled.div<{ variant: keyof typeof EVariants }>`
  display: block;
  margin: .75rem 0;
  border-radius: 3px;
  padding: .75rem;
  background: ${(props): string => props.variant ? colors[props.variant].background : '#fff'};
  color: ${(props): string => props.variant ? colors[props.variant].text : '#000'};
`;

export const Notification: React.FC<INotificationProps> = ({ message, variant }) => {
  return (
    <StyledDiv variant={variant} data-testid={`notification-${variant}`}>
      {message}
    </StyledDiv>
  )
}
