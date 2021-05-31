import React, { useEffect, useState } from 'react';
import { LoadError } from '@react-pdf-viewer/core';
import styled from '@emotion/styled';

const getMessage = (name: string): string => {
	switch (name) {
		case 'InvalidPDFException':
				return 'Il documento non e leggibile';
		case 'MissingPDFException':
				return 'Il documento non e stato trovato';
		case 'UnexpectedResponseException':
				return 'Risposta errata dal server';
		default:
				return 'Documento non caricabile';
	}
}

const StyledError = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    .container {
        padding: 0.5rem;
        background-color: #e53e3e;
        border-radius: 0.25rem;
        color: #fff;
    }
`;

export const ErrorViewer: React.FC<LoadError> = ({ message, name }) => {
	const [errorMessage, setErrorMessage] = useState('');

	useEffect(() => {
		setErrorMessage(getMessage(name));
	}, [message, name]);

    return (
        <StyledError>
            <div className="container">
                {errorMessage}
            </div>
        </StyledError>
    );
};
