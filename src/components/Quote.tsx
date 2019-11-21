import React, { useState } from 'react';
import styled from '@emotion/styled';

import { StyledH2 } from './styled';
import { Icon } from './icons';
import { QuoteForm } from './forms';
import { IQuote } from '../services/firebase/types';

interface IQuoteProps {
  quote: IQuote;
}

const StyledQuote = styled.div`
  
  .header {
    display: flex;
    justify-content: space-between;
  }

  .icon {
    width: 2rem;
    text-align: center;
    padding-top: .25rem;
  }

  .quote {
    position: relative;
    margin: 1rem 0;

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
  }
`;

export const Quote: React.FC<IQuoteProps> = ({ quote }) => {
  const [isEditing, setIsEditing] = useState(false)
  const { url, text } = quote;

  return (
    <StyledQuote>
      <div className="header">
        <StyledH2>Citazione del mese</StyledH2>
        <span className="icon" onClick={(): void => setIsEditing(!isEditing)}>
          <Icon.Pencil color="#fff" />
        </span>
      </div>
      <div className="quote">
        {isEditing ? (
          <QuoteForm initialState={quote} />
        ) : (
            <>
              <p>{text}</p>
              <img src={url} />
            </>
          )}
      </div>
    </StyledQuote>
  );
};
