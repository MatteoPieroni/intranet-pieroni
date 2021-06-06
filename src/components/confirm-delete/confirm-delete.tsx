import styled from '@emotion/styled';
import React from 'react';
import { Button } from '../button';
import { WarningIcon } from '../icons/Icon';

interface IConfirmDeleteProps {
	onConfirm: () => void;
	onCancel: () => void;
	warningMessage?: string;
	list: string[];
}

const StyledDiv = styled.div`
	padding: .5rem 0;

	ul {
    list-style: initial;
    margin-top: .5rem;
    margin-bottom: 1rem;
    padding-inline-start: 1.5rem;
	}

	.warning {
    display: flex;
		background: #ffedb9;
		padding: 1rem;
		margin-bottom: 1rem;

		svg {
			margin-right: .5rem;
			color: #F13C20;
		}
	}

	.buttons-container {
		display: flex;
		justify-content: flex-end;

		button:not(:last-of-type) {
			margin-right: .5rem;
		}
	}
`;

export const ConfirmDelete: React.FC<IConfirmDeleteProps> = ({ onConfirm, onCancel, list, warningMessage }) => {
	return (
		<StyledDiv>
			<ul>
				{list.map(entry => <li key={entry}>{entry}</li>)}
			</ul>
			{warningMessage && (
				<div className="warning">
					<WarningIcon />
					<p>{warningMessage}</p>
				</div>
			)}
			<div className="buttons-container">
				<Button onClick={onCancel}>
					Annulla
				</Button>
				<Button onClick={onConfirm} ghost>
					Conferma
				</Button>
			</div>
		</StyledDiv>
	);
}