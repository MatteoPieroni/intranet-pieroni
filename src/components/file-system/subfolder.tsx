import React from 'react';
import styled from '@emotion/styled';

import { IFolder } from '../../services/firebase/types';
import { Icon } from '../icons';

interface ISubFolderProps {
	folder: IFolder;
	onSelect: (folder: string) => void;
}

const StyledFolder = styled.div`
	text-align: center;

	svg {
		display: block;
		margin: 0 auto;
		font-size: 3rem;
	}
`;

export const SubFolder: React.FC<ISubFolderProps> = ({ folder, onSelect }) => {
	const getHandleKeyboardSelectFolder: (folder: string) => (event: React.KeyboardEvent<HTMLButtonElement>) => void = 
		(folderName) => (event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				onSelect(folderName)
			}
		};

	return (
		<StyledFolder>
			<button
				onDoubleClick={(): void => onSelect(folder.id)}
				onKeyPress={getHandleKeyboardSelectFolder(folder.id)}
			>
				<Icon.Folder aria-hidden />
				{folder.name}
			</button>
		</StyledFolder>
	);
};
