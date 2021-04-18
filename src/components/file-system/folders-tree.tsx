import React, { useMemo, useState } from 'react';
import styled from '@emotion/styled';

import { Icon } from '../icons';
import { ICategoryWithSubfolders, IOrganisedCategories } from '../../utils/file-system';
import { useCurrentFolder } from './file-system';
import { Item, Menu, useContextMenu } from 'react-contexify';
import { CataloguesService } from '../../services/firebase/db';
import { CategoriesForm } from '../forms/catalogues-form/categories-form';

interface IFoldersTreeProps {
	folders: IOrganisedCategories;
	onSelect: (folder: { id: string; label: string }) => void;
	initialIsExpanded?: boolean;
}

interface ISubFolderProps {
	folder: ICategoryWithSubfolders;
	onSelect: (folder: { id: string; label: string }) => void;
	isRoot?: boolean;
}


const StyledTree = styled.ul<{ isExpanded?: boolean }>`
	margin-top: .75rem;
	padding-left: 1rem;

	${(props): string => !props.isExpanded && `> li {
		display: none;
	}
	`}
`;

const StyledFolder = styled.li<{ isActive?: boolean }>`
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

const StyledRootFolder = styled.div<{ isActive?: boolean }>`
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

export const SubFolder: React.FC<ISubFolderProps> = ({ folder, onSelect, isRoot = false }) => {
	const { show } = useContextMenu({ id: folder.id });
	const [isCreating, setIsCreating] = useState(false);
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

	const createSubCategory: () => void = () => setIsCreating(true);
	const saveSubCategory: () => void = () => setIsCreating(false);

	const deleteCategory: () => Promise<void> = async () => {
		await CataloguesService.removeCategory(folder.id);
	}

	const Wrapper = isRoot ? StyledRootFolder : StyledFolder;

	return (
		<>
			<Wrapper isActive={isActive}>
				<button
					onClick={handleSelect}
					onKeyPress={handleKeyboardSelectFolder}
					onContextMenu={show}
				>
					<Icon.Folder aria-hidden />
					{folder.label} ({folder.fileCount})
				</button>
				{folder.subfolders ? (
					<FoldersTree folders={folder.subfolders} onSelect={onSelect} initialIsExpanded={isRoot}>
						{isCreating && (<CategoriesForm folder={folder} onSave={saveSubCategory} />)}
					</FoldersTree>
				) : (
					isCreating && (<CategoriesForm folder={folder} onSave={saveSubCategory} />)
				)}
			</Wrapper>
			<Menu id={folder.id}>
				<Item onClick={createSubCategory}>Crea nuova sottocategoria</Item>
				<Item onClick={deleteCategory}>Elimina categoria</Item>
			</Menu>
		</>
	);
};

export const FoldersTree: React.FC<IFoldersTreeProps> = ({ folders, onSelect, initialIsExpanded, children }) => {
	const [isExpanded, setIsExpanded] = useState(initialIsExpanded);

	const toggleExpanded = (): void => setIsExpanded(!isExpanded);

	return (
		<>
			<button onClick={toggleExpanded}>{isExpanded ? '-' : '+'}</button>
			<StyledTree isExpanded={isExpanded}>
				{Object.values(folders).map(folder => (
					<SubFolder key={folder.id} folder={folder} onSelect={onSelect} />
				))}
				{children}
			</StyledTree>
		</>
	);
};
