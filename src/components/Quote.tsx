import React from 'react';
import styled from '@emotion/styled';

interface IQuoteProps {
  source: string;
  text: string;
}

const StyledQuote = styled.div`
  position: relative;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
  }

  p {
    position: absolute;
    top: 50%;
    padding: 5%;
    font-size: 1.8rem;
    line-height: 2.3rem;
    color: #fff;
    transform: translateY(-50%);
  }

  img {
    display: block;
    max-width: 100%;
  }
`;

export const Quote: React.FC<IQuoteProps> = ({ source, text }) => {
  return (
    <StyledQuote>
      <p>{text}</p>
      <img src={source} />
    </StyledQuote>
  );
};
