import React from 'react';

export const HiddenContent: React.FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>> =
	({ children, ...rest }) => <span className="visually-hidden" {...rest}>{children}</span>;