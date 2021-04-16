import React, { useState } from 'react';
import styled from '@emotion/styled';

import { Icon } from '../icons';
import { ICategoryWithSubfolders, IOrganisedCategories } from '../../utils/file-system';
import { useCurrentFolder } from './file-system';

interface IFoldersTreeProps {
	folders: IOrganisedCategories;
	onSelect: (folder: { id: string; label: string }) => void;
	isRoot?: boolean;
}
interface ISubFolderProps {
	folder: ICategoryWithSubfolders;
	onSelect: (folder: { id: string; label: string }) => void;
}

const StyledTree = styled.ul<{ isExpanded?: boolean }>`
	margin-top: .75rem;
	padding-left: 1rem;

	${(props): string => !props.isExpanded && `> li {
		display: none;
	}
	`}
`;

const StyledFolder = styled.li<{ isActive: boolean }>`
	margin-bottom: .75rem;

	> button {
		font-size: 1rem;
		color: ${(props): string => props.isActive ? 'teal' : 'black'};
	}

	svg {
		display: inline-block;
		margin: 0 .5rem 0;
	}
`;

export const SubFolder: React.FC<ISubFolderProps> = ({ folder, onSelect }) => {
	const { currentFolder } = useCurrentFolder();
	const isActive = folder.id === currentFolder?.id;

	const handleSelect = (): void => {
		if (isActive) {
			return;
		}

		onSelect(folder);
	}

	const handleKeyboardSelectFolder: (event: React.KeyboardEvent<HTMLButtonElement>) => void = (event): void => {
			if (event.key === 'Enter' || event.key === ' ') {
				handleSelect()
			}
		};

	return (
		<StyledFolder isActive={isActive}>
			<button
				onDoubleClick={handleSelect}
				onKeyPress={handleKeyboardSelectFolder}
			>
				<Icon.Folder aria-hidden />
				{folder.label} ({folder.fileCount})
			</button>
			{folder.subfolders && <FoldersTree folders={folder.subfolders} onSelect={onSelect} />}
		</StyledFolder>
	);
};

export const FoldersTree: React.FC<IFoldersTreeProps> = ({ folders, onSelect, isRoot = false }) => {
	const [isExpanded, setIsExpanded] = useState(isRoot);

	const toggleExpanded = (): void => setIsExpanded(!isExpanded);

	return (
		<>
			{!isRoot && (<button onClick={toggleExpanded}>{isExpanded ? '-' : '+'}</button>)}
			<StyledTree isExpanded={isExpanded}>
				{Object.values(folders).map(folder => (
					<SubFolder key={folder.id} folder={folder} onSelect={onSelect} />
				))}
			</StyledTree>
		</>
	);
};
