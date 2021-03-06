import React, { useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';

import { ICategoryWithSubfolders, IOrganisedCategories } from '../../utils/file-system';
import { ICurrentFolder, useCurrentFolder } from './file-system';
import { Item, Menu, useContextMenu } from 'react-contexify';
import { CataloguesService } from '../../services/firebase/db';
import { CategoriesForm } from '../forms/catalogues-form/categories-form';
import { CaretDown, CaretRight } from '../icons/Icon';
import { Checkbox } from '../inputs/checkbox';
import { HiddenContent } from '../hidden-content/hidden-content';

interface IFoldersTreeProps {
	folders: IOrganisedCategories;
	onSelect: (folder: ICurrentFolder) => void;
	onToggle: (folder: ICategoryWithSubfolders) => void;
	isExpanded: boolean;
}

interface ISubFolderProps {
	folder: ICategoryWithSubfolders;
	onSelect: (folder: ICurrentFolder) => void;
	onToggle: (folder: ICategoryWithSubfolders) => void;
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
	position: relative;
	margin-bottom: .75rem;

	&:before {
		content: "";
		width: 2px;
		height: 100%;
		background-color: #434e65;
		position: absolute;
		bottom: 0;
		left: calc(1rem - 11px);
	}

	.folder-container {
		display: inline-block;
		padding-left: .5rem;

		&:before {
			content: "";
			position: absolute;
			background-color: #434e65;
			width: 10px;
			height: 2px;
			top: 50%;
			left: 0;
			transform: translate(-100%, -50%);
		}
	}

	&:last-child .folder-container:after {
		content: "";
		position: absolute;
		background-color: #202228;
		width: 2px;
		height: calc(50% - 1px);
		left: -11px;
		bottom: 0;
	}

	.folder-label {
		/* color: ${(props): string => props.isActive ? 'teal' : 'black'}; */
		font-size: 1rem;
	}

	
`;

const StyledRootFolder = styled.div<{ isActive?: boolean }>`
	position: relative;
	margin-bottom: .75rem;

	&:before {
		content: "";
		width: 2px;
		height: 100%;
		background-color: #434e65;
		position: absolute;
		bottom: 0;
		left: calc(1rem - 11px);
	}

	.single-folder {
		position: relative;
		padding: 0.35rem 0.5rem;
		background-color: #2a2e36;
		color: #ffffff;
		border-radius: 5px;
	}

	button {
		color: #ffffff;
	}

	.folder-label {
		font-size: 1rem;
	}

	svg {
		display: inline-block;
		margin-right: .5rem;
	}

	> ul > li:last-of-type:after {
		content: "";
		position: absolute;
		background-color: #202228;
		width: 2px;
		height: calc(100% - 32px);
		left: -11px;
		bottom: 0;
	}
`;

const FolderContainer: React.FC<{ hasSubfolders: boolean; onClick: () => void }> = ({ hasSubfolders, onClick, children }) =>
	hasSubfolders ? (
		<button onClick={onClick} className="folder-container">
			{children}
		</button>
	) : (
		<p className="folder-container">
			{children}
		</p>
	);

export const SubFolder: React.FC<ISubFolderProps> = ({
	folder,
	onSelect,
	onToggle,
	isRoot = false,
}) => {
	const { show } = useContextMenu({ id: folder.id || 'home' });
	const [isExpanded, setIsExpanded] = useState(isRoot);
	const toggleExpanded = (): void => setIsExpanded(!isExpanded);

	const [isEditing, setIsEditing] = useState(false);
	const [isCreating, setIsCreating] = useState(false);
	const { currentFolders } = useCurrentFolder();
	const isActive = useMemo(() => currentFolders.some(currentFolder => folder.id === currentFolder?.id), [currentFolders, folder]);

	useEffect(() => {
		if (isActive && !isExpanded) {
			setIsExpanded(true);
		}
	}, [isActive])

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
								<>
									<Checkbox
										ariaLabelledBy={`folder-name-${folder.id}`}
										checked={isActive}
										onChange={handleToggle}
									/>
									<HiddenContent id={`folder-name-${folder.id}`}>Seleziona {folder.label} {!isRoot && folder.fileCount > 0 ? `(${folder.fileCount})` : ''}</HiddenContent>
								</>
							)}
							<FolderContainer hasSubfolders={!!folder.subfolders} onClick={toggleExpanded}>
								{folder.subfolders && (isExpanded ? <CaretDown /> : <CaretRight />)}
								<span
									className="folder-label"
								>
									<HiddenContent>Espandi </HiddenContent>{folder.label} {!isRoot && folder.fileCount > 0 ? `(${folder.fileCount})` : ''}
								</span>
							</FolderContainer>
							</div>
				)}
				{folder.subfolders ? (
					<FoldersTree isExpanded={isExpanded} folders={folder.subfolders} onSelect={onSelect} onToggle={onToggle}>
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

export const FoldersTree: React.FC<IFoldersTreeProps> = ({ folders, onSelect, onToggle, isExpanded, children }) => {
	return (
		<>
			<StyledTree isExpanded={isExpanded}>
				{Object.values(folders).map(folder => (
					<SubFolder
						key={folder.id}
						folder={folder}
						onSelect={onSelect}
						onToggle={onToggle}
					/>
				))}
				{children}
			</StyledTree>
		</>
	);
};
