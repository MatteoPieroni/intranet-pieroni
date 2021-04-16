import React from 'react';
import styled from '@emotion/styled';

import { Icon } from '../icons';
import { ICategoryWithSubfolders, IOrganisedCategories } from '../../utils/file-system';

interface IFoldersTreeProps {
	folders: IOrganisedCategories;
	onSelect: (folder: { id: string; label: string }) => void;
}
interface ISubFolderProps {
	folder: ICategoryWithSubfolders;
	onSelect: (folder: { id: string; label: string }) => void;
}

const StyledTree = styled.ul`
	background: red;
`;

const StyledFolder = styled.li`
	text-align: center;

	svg {
		display: block;
		margin: 0 auto;
		font-size: 3rem;
	}
`;

export const SubFolder: React.FC<ISubFolderProps> = ({ folder, onSelect }) => {
	const getHandleKeyboardSelectFolder: (folder: { id: string; label: string }) => (event: React.KeyboardEvent<HTMLButtonElement>) => void = 
		(folder) => (event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				onSelect(folder)
			}
		};

	return (
		<StyledFolder>
			<button
				onDoubleClick={(): void => onSelect(folder)}
				onKeyPress={getHandleKeyboardSelectFolder(folder)}
			>
				<Icon.Folder aria-hidden />
				{folder.label}
			</button>
			{folder.subfolders && <FoldersTree folders={folder.subfolders} onSelect={onSelect} />}
		</StyledFolder>
	);
};

export const FoldersTree: React.FC<IFoldersTreeProps> = ({ folders, onSelect }) => {
	return (
		<StyledTree>
			{Object.values(folders).map(folder => (
				<SubFolder key={folder.id} folder={folder} onSelect={onSelect} />
			))}
		</StyledTree>
	);
};
