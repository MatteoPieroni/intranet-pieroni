/** @jsx jsx */
import { jsx } from '@emotion/core';
import styled from '@emotion/styled';

interface ITemplateProps {
  children: React.ReactNode | React.ReactNode[];
}

const TemplateContainer = styled.div`
  /* background: red; */
`;

export const Template: React.FC<ITemplateProps> = ({ children }) => {
  return (
    <TemplateContainer>
      {children}
    </TemplateContainer>
  )
}
