import React from 'react';

interface IQuoteProps {
  source: string;
  text: string;
}

export const Quote: React.FC<IQuoteProps> = ({ source, text }) => {
  return (
    <div>
      <p>{text}</p>
      <img src={source} />
    </div>
  );
};
