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
  padding: 1rem;
  
  .info-container {

    @media (min-width: 1024px) {
      max-width: 40%;
    }
  }

  .welcome-container {
    margin-bottom: 1rem;
  }

  .links-container {
    flex-grow: 1;
    margin-left: 2rem;
  }
`;


export const Home: () => JSX.Element = () => {
  const links = useLinks();
  const quote = useQuote();

  return (
    <StyledPage>
      <div className="info-container">
        <div className="welcome-container">
          <WelcomeMessage />
        </div>
        {quote && (
          <div className="quote-container">
            <Quote quote={quote} />
          </div>
        )}
      </div>
      {links && (
        <div className="links-container">
          <Links links={links} />
        </div>
      )}
    </StyledPage>
  );
};
