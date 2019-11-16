import React from 'react';
import styled from '@emotion/styled';

import { Quote } from '../components/Quote';
import { Links } from '../components/Links';
import { WelcomeMessage } from '../components/WelcomeMessage';
import { useLinks } from '../shared/hooks/useLinks';
import { useQuote } from '../shared/hooks/useQuote';

const StyledPage = styled.main`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  
  .quote-container {

    @media (min-width: 1024px) {
      max-width: 40%;
    }
  }
`;


export const Home: () => JSX.Element = () => {
  const links = useLinks();
  const quote = useQuote();

  return (
    <StyledPage>
      <div className="welcome-container">
        <WelcomeMessage />
      </div>
      {links && (
        <div className="links-container">
          <Links links={links} />
        </div>
      )}
      {quote && (
        <div className="quote-container">
          <Quote source={quote.url} text={quote.text} />
        </div>
      )}
    </StyledPage>
  );
};
