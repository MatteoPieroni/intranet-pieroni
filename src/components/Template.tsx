/** @jsx jsx */
import { jsx } from '@emotion/core';
import styled from '@emotion/styled';

interface ITemplateProps {
  children: React.ReactNode | React.ReactNode[];
}

const TemplateContainer = styled.div`
  min-height: calc(100% - 3rem);
  background: #374785;
  overflow: auto;
`;

export const Template: React.FC<ITemplateProps> = ({ children }) => {
  return (
    <TemplateContainer>
      {children}
    </TemplateContainer>
  )
}
