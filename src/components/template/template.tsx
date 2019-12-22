/** @jsx jsx */
import { jsx } from '@emotion/core';
import styled from '@emotion/styled';

interface ITemplateProps {
  withHeader?: boolean;
  children: React.ReactNode | React.ReactNode[];
}

const TemplateContainer = styled.div<{ withHeader?: boolean }>`
  min-height: ${(props): string => props.withHeader ? 'calc(100% - 3rem)' : '100%'};
  background: #374785;
  overflow: auto;
`;

export const Template: React.FC<ITemplateProps> = ({ children, withHeader }) => {
  return (
    <TemplateContainer withHeader={withHeader}>
      {children}
    </TemplateContainer>
  )
}
