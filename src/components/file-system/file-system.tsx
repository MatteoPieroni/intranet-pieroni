import React, { createContext, useContext, useMemo, useState } from 'react';
import styled from '@emotion/styled';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

import { IFile } from '../../services/firebase/db';
import { useConfig, useSearch } from '../../shared/hooks';
import { ICategoriesLookup, ICategoryWithSubfolders, IEnrichedFile, IOrganisedData } from '../../utils/file-system';
import { SubFolder } from './folders-tree';
import { getCurrentFiles } from './utils/get-current-files';
import { toggleAllSubfolders } from './utils/toggle-all-subfolders';
import { PdfViewer } from '../pdf-viewer';
import { Modal } from '../modal';
import { CataloguesForm } from '../forms/catalogues-form';
import { MultiCataloguesForm } from '../forms/catalogues-form/multi-catalogues-form';
import { Checkbox } from '../inputs/checkbox';
import css from '@emotion/css';
import { Button } from '../button';
import { GridIcon, ListIcon, SearchIcon, SyncIcon } from '../icons/Icon';
import { FileList, IView } from './file-list';
import { CataloguesApiService } from '../../services/catalogues-api';

const StyledContainer = styled.div`
	margin: 2rem auto;
	max-width: 1600px;
	background: #fff;

	.header {
		display: flex;
		flex-wrap: wrap;
	}

	.current-folder {
		flex: 2;
		padding: .5rem;
		background-color: #24305e;
		color: #fff;
		line-height: 2rem;
	}

	.search-field {
		flex: 1;
		display: flex;
		padding: .5rem;

		input {
			flex: 1;
		}

		svg {
			padding: .5rem;
			width: 1rem;
			height: 1rem;
		}
	}

	.select-bar {
		width: 100%;
	}

	.filesystem-container {
		display: grid;
		grid-template-columns: minmax(auto, 250px) 1fr;
	}

	.folders-menu {
		padding: 1rem;
		background-color: #202228;

		> ul {
			padding: 0;
		}
	}
`;

const checkboxStyles = css`
	border: 1px solid black;
`;

export type ICurrentFolder = {
	id: string;
	label: string;
};

interface ICurrentFolderContext {
	currentFolders: ICurrentFolder[];
	setCurrentFolder: (folder: ICurrentFolder) => void;
	toggleSelectedFolders: (folder: ICurrentFolder, subfolders?: ICurrentFolder[]) => void;
}

interface ICataloguesContext {
	categoriesLookup: ICategoriesLookup;
}

interface ISelectedContext {
	selectFile: (file: IFile | IEnrichedFile) => void;
	files: (IFile | IEnrichedFile)[];
	startEditing: () => void;
}

const baseHomeFolder = {
	id: '',
	label: 'Home',
	parent: '',
	depth: -1,
	fileCount: 0,
};

const CurrentFolderContext = createContext<Partial<ICurrentFolderContext>>({});
const CataloguesContext = createContext<ICataloguesContext>({} as ICataloguesContext);
const SelectedContext = createContext<ISelectedContext>(null);
export const useCurrentFolder = (): Partial<ICurrentFolderContext> => useContext(CurrentFolderContext);
export const useCatalogueUtilities = (): ICataloguesContext => useContext(CataloguesContext);
export const useSelected = (): ISelectedContext => useContext(SelectedContext);

export const FileSystem: React.FC<IOrganisedData> = ({ files, categories, categoriesLookup, filesList }) => {
	const { isInternal, apiUrl } = useConfig();
	const [currentFolders, setCurrentFolders] = useState<ICurrentFolder[]>([]);
	const [selectedFiles, setSelectedFiles] = useState<(IFile | IEnrichedFile)[]>([]);
	const [shownFile, setShownFile] = useState<IFile | IEnrichedFile>();
	const shownUrl = shownFile ?
		isInternal ?
			`${apiUrl}/file/${shownFile.filename}` :
			shownFile.storeUrl :
		'';
	const resetShownFile = (): void => setShownFile(null);

	const [isEditing, setIsEditing] = useState(false);

	const startEditing = (): void => setIsEditing(true);
	const finishEditing = (): void => setIsEditing(false);

	const [isSyncing, setIsSyncing] = useState(false);

	const [allSelected, setAllSelected] = useState(false);

	const [view, setView] = useState<IView>(() => {
		return (localStorage.getItem('file-view') as IView) || 'table';
	});

	const { isSearching, onSearch, results } = useSearch(filesList, {
			includeScore: false,
			keys: ['label', 'categoriesId.label']
		});

	const shownFiles: IFile[] = useMemo(() => {
		if (isSearching) {
			return results as unknown as IFile[];
		}

		if (currentFolders.length > 0) {
			return getCurrentFiles(currentFolders, files)
		}
		
		return filesList as unknown as IFile[];
	}, [currentFolders, files, isSearching, results]);

	const displayedFolder = (): string => {
		if (isSearching) {
			return 'Risultati di ricerca'
		}

		if (currentFolders.length > 1) {
			return `${currentFolders.length} categorie`;
		}
		
		if (currentFolders.length === 1) {
			return currentFolders[0].label;
		}
		return 'Home'
	};

	const homeFolder = useMemo(() => {
		return {
			...baseHomeFolder,
			subfolders: categories,
		}
	}, [categories]);

	const toggleView = (): void => {
		localStorage.setItem('file-view', view === 'grid' ? 'table' : 'grid');

		setView(view === 'grid' ? 'table' : 'grid');
	}

	const syncServer = async (): Promise<void> => {
		setIsSyncing(true);

		await CataloguesApiService.sync(() => {
			setIsSyncing(false);
		});
	}

	const setCurrentFolder = (folder: ICurrentFolder): void => folder.id ? setCurrentFolders([folder]) : setCurrentFolders([]);

	const toggleSelectedFile = (file: IFile | IEnrichedFile): void => {
		const fileIndex = selectedFiles.findIndex(selectedFile => selectedFile.id === file.id);

		if (fileIndex > -1) {
			const selectedWithout = [...selectedFiles];
			selectedWithout.splice(fileIndex, 1);

			setSelectedFiles([...selectedWithout]);
			return;
		}

		setSelectedFiles([...selectedFiles, file]);
	}

	const toggleSelectAll = (): void => {
		if (allSelected) {
			setSelectedFiles([]);
		} else {
			setSelectedFiles(shownFiles);
		}

		setAllSelected(!allSelected);
	}

	const deselectAll = (): void => {
		setSelectedFiles([]);
		setAllSelected(false);
	}


	const toggleSelectedFolders = (folder: ICategoryWithSubfolders): void => {
		deselectAll();
		const isParentFolderActive = currentFolders.some(fold => fold.id === folder.id);
		const hasSubFolder = folder.subfolders;

		// if there are no subfolder
		if (!hasSubFolder) {
			// and the folder isn't selected
			if (!isParentFolderActive) {
				// add it to selected
				return setCurrentFolders([...currentFolders, folder]);
			}

			// if the current folder is selected
			// remove it
			return setCurrentFolders(currentFolders.filter(fold => fold.id !== folder.id));
		}
		
		setCurrentFolders(toggleAllSubfolders(currentFolders, folder));
	};

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
		deselectAll();
		onSearch(event);
	}

	return (
		<CurrentFolderContext.Provider value={{currentFolders, setCurrentFolder, toggleSelectedFolders}}>
			<CataloguesContext.Provider value={{categoriesLookup}}>
				<SelectedContext.Provider value={{ files: selectedFiles, selectFile: toggleSelectedFile, startEditing }}>
					<StyledContainer>
						<div className="header">
							<div className="current-folder">
								{displayedFolder()}
							</div>
							<div className="search-field">
								<input type="search" onChange={handleSearch} aria-labelledby="filesystem-search-icon" />
								<SearchIcon id="filesystem-search-icon" alt="Cerca" />
							</div>
							<div className="select-bar">
									<Checkbox checked={allSelected} onChange={toggleSelectAll} label={allSelected ? 'Deseleziona tutti' : 'Seleziona tutti'} css={checkboxStyles} />
									<Button onClick={startEditing} disabled={selectedFiles.length === 0}>Modifica file</Button>
									<Button onClick={toggleView} ghost icon={view === 'grid' ? ListIcon : GridIcon}>
										{view === 'grid' ? 'Tabella' : 'Griglia'}
									</Button>
									{isInternal && <Button icon={SyncIcon} onClick={syncServer} disabled={isSyncing}>Sincronizza</Button>}
							</div>
						</div>
						<div className="filesystem-container">
							{!isSearching && (
								<div className="folders-menu">
									<SubFolder folder={homeFolder} onSelect={setCurrentFolder} onToggle={toggleSelectedFolders} isRoot />
								</div>
							)}
							<FileList files={shownFiles} viewFile={setShownFile} view={view} />
						</div>
					</StyledContainer>
					{shownFile && <PdfViewer url={shownUrl} closeModal={resetShownFile} />}
					{selectedFiles.length !== 0 && (
						<Modal isOpen={isEditing} closeModal={finishEditing} className="modal-small">
							{selectedFiles.length > 1 ? (
								<>
									<h2>Modifica {selectedFiles.length} cataloghi</h2>
									<MultiCataloguesForm files={selectedFiles} onSave={finishEditing} />
								</>
							) : (
								<>
									<h2>Modifica catalogo</h2>
									<CataloguesForm file={selectedFiles[0]} onSave={finishEditing} />
								</>
							)}
						</Modal>
					)}
				</SelectedContext.Provider>
			</CataloguesContext.Provider>
		</CurrentFolderContext.Provider>
	)
}