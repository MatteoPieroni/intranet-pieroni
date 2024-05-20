import React, { useState } from 'react';
import styled from '@emotion/styled';

import { StyledH2 } from '../styled';
import { Icon } from '../icons';
import { QuoteForm } from '../forms';
import { Button } from '../button';
import { IQuote } from '../../services/firebase/db';
import { useUser } from '../../shared/hooks';

interface IQuoteProps {
  quote: IQuote;
  refresh: () => void;
}

const StyledQuote = styled.div`
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .form-button .button {
    border-bottom-color: #FFF;
    color: #FFF;
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

    p, .form {
      position: absolute;
      top: 50%;
      padding: 5%;
      font-size: 1.2rem;
      line-height: 1.5rem;
      color: #fff;
      transform: translateY(-50%);
    }

    .form {
      width: 100%;
      font-size: 1.8rem;
      line-height: 2.3rem;
      box-sizing: border-box;
    }

    img {
      display: block;
      max-width: 100%;
    }
  }
`;

export const Quote: React.FC<IQuoteProps> = ({ quote, refresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [user] = useUser();
  const { isAdmin } = user;
  const { url, text } = quote;

  const onSave = (): void => {
    refresh();
    setIsEditing(false);
  }

  return (
    <StyledQuote>
      <div className="header">
        <StyledH2 data-testid="quote-title">Citazione del mese</StyledH2>
        {isAdmin && (
          <Button icon={Icon.Pencil} ghost className="form-button" onClick={(): void => setIsEditing(!isEditing)}>
            Modifica
          </Button>
        )}
      </div>
      <div className="quote">
        {isAdmin && isEditing ? (
          <QuoteForm initialState={quote} className="form" onSave={onSave} />
        ) : (
          <p>{text}</p>
        )}
        <img src={url} role="presentation" />
      </div>
    </StyledQuote>
  );
};
