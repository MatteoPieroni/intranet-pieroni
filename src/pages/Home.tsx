import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';

import { Quote, Links, WelcomeMessage, Loader } from '../components';
import { useLinks, useQuote } from '../shared/hooks';

const StyledPage = styled.main`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 1rem;

  h1 {
    color: #333;
  }
  
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
  const [loading, setLoading] = useState(true);
  const links = useLinks();
  const [quote, refreshQuote, loadingQuote] = useQuote();

  useEffect(() => {
    if (loadingQuote) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [loadingQuote])

  return (
    !loading ? (
      <StyledPage>
        <div className="info-container">
          <div className="welcome-container">
            <WelcomeMessage />
          </div>
          {quote && (
            <div className="quote-container">
              <Quote quote={quote} refresh={refreshQuote} />
            </div>
          )}
        </div>
        {links && (
          <div className="links-container">
            <Links links={links} />
          </div>
        )}
      </StyledPage>
    ) : <Loader />
  );
};

export default Home;