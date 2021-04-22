import React, { useMemo, useState } from 'react';
import styled from '@emotion/styled';

import { Icon } from '../icons';
import { ICategoryWithSubfolders, IOrganisedCategories } from '../../utils/file-system';
import { ICurrentFolder, useCurrentFolder } from './file-system';
import { Item, Menu, useContextMenu } from 'react-contexify';
import { CataloguesService } from '../../services/firebase/db';
import { CategoriesForm } from '../forms/catalogues-form/categories-form';

interface IFoldersTreeProps {
	folders: IOrganisedCategories;
	onSelect: (folder: ICurrentFolder) => void;
	onToggle: (folder: ICurrentFolder) => void;
	initialIsExpanded?: boolean;
}

interface ISubFolderProps {
	folder: ICategoryWithSubfolders;
	onSelect: (folder: ICurrentFolder) => void;
	onToggle: (folder: ICurrentFolder) => void;
	isRoot?: boolean;
}


const StyledTree = styled.ul<{ isExpanded?: boolean }>`
	margin-top: .75rem;
	padding-left: 1rem;
	width: 100%;
	${(props): string => !props.isExpanded && `> li {
		display: none;
	}
	`}
`;

const StyledFolder = styled.li<{ isActive?: boolean }>`
	display: flex;
	flex-wrap: wrap;
	margin-bottom: .75rem;
	justify-content: space-between;
	.folder-label {
		color: ${(props): string => props.isActive ? 'teal' : 'black'};
		font-size: 1rem;
	}

	svg {
		display: inline-block;
		margin: 0 .5rem 0;
	}
`;

const StyledRootFolder = styled.div<{ isActive?: boolean }>`
	display: flex;
	flex-wrap: wrap;
	margin-bottom: .75rem;
	justify-content: space-between;

	.folder-label {
		font-size: 1rem;
	}

	svg {
		display: inline-block;
		margin: 0 .5rem 0;
	}
`;

export const SubFolder: React.FC<ISubFolderProps> = ({ folder, onSelect, onToggle, isRoot = false }) => {
	const { show } = useContextMenu({ id: folder.id || 'home' });
	const [isCreating, setIsCreating] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const { currentFolders } = useCurrentFolder();
	const isActive = useMemo(() => currentFolders.some(currentFolder => folder.id === currentFolder?.id), [currentFolders, folder]);

	const handleSelect = (): void => {
		onSelect(folder);
	}

	const handleToggle = (): void => {
		onToggle(folder);
	}

	const createSubCategory: () => void = () => setIsCreating(true);
	const editSubCategory: () => void = () => setIsEditing(true);
	const saveSubCategory: () => void = () => {
		setIsCreating(false);
		setIsEditing(false);
	}
	const newSubFolder: ICategoryWithSubfolders = {
		parent: isRoot ? '' : folder.id,
		label: '',
		id: '',
		depth: folder.depth + 1,
		subfolders: null,
		fileCount: 0,
	}

	const deleteCategory: () => Promise<void> = async () => {
		await CataloguesService.removeCategory(folder.id);
	}

	const Wrapper = isRoot ? StyledRootFolder : StyledFolder;

	return (
		<>
			<Wrapper isActive={isActive}>
				{isEditing ? (
						<CategoriesForm folder={folder} onSave={saveSubCategory} />
					) : (
						<div onContextMenu={show} className="single-folder">
							{!isRoot && (
								<input
									type="checkbox"
									aria-labelledby={`folder-name-${folder.id}`}
									checked={isActive}
									onChange={handleToggle}
								/>
							)}
							<Icon.Folder aria-hidden />
							<button
								onClick={handleSelect}
								>
								<span
									id={`folder-name-${folder.id}`}
									className="folder-label"
								>
									{folder.label} {isRoot ? '' : `(${folder.fileCount})`}
								</span>
							</button>
							</div>
				)}
				{folder.subfolders ? (
					<FoldersTree folders={folder.subfolders} onSelect={onSelect} initialIsExpanded={isRoot} onToggle={onToggle}>
						{isCreating && (<CategoriesForm folder={newSubFolder} onSave={saveSubCategory} />)}
					</FoldersTree>
				) : (
					isCreating && (<CategoriesForm folder={newSubFolder} onSave={saveSubCategory} />)
				)}
			</Wrapper>
			<Menu id={folder.id || 'home'}>
				<Item onClick={createSubCategory}>Crea nuova sottocategoria</Item>
				<Item onClick={editSubCategory} disabled={isRoot}>Rinomina categoria</Item>
				<Item onClick={deleteCategory} disabled={isRoot}>Elimina categoria</Item>
			</Menu>
		</>
	);
};

export const FoldersTree: React.FC<IFoldersTreeProps> = ({ folders, onSelect, onToggle, initialIsExpanded, children }) => {
	const [isExpanded, setIsExpanded] = useState(initialIsExpanded);

	const toggleExpanded = (): void => setIsExpanded(!isExpanded);

	return (
		<>
			<button onClick={toggleExpanded}>{isExpanded ? '-' : '+'}</button>
			<StyledTree isExpanded={isExpanded}>
				{Object.values(folders).map(folder => (
					<SubFolder key={folder.id} folder={folder} onSelect={onSelect} onToggle={onToggle} />
				))}
				{children}
			</StyledTree>
		</>
	);
};
