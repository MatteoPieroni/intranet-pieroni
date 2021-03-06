import React, { createContext, useContext, useMemo, useRef, useState } from 'react';
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
import { CataloguesForm, UploadCataloguesForm } from '../forms/catalogues-form';
import { MultiCataloguesForm } from '../forms/catalogues-form/multi-catalogues-form';
import { Checkbox } from '../inputs/checkbox';
import { Button } from '../button';
import { GridIcon, ListIcon, MenuIcon, Pencil, SearchIcon, SyncIcon, Trash, UploadIcon } from '../icons/Icon';
import { FileList, IView } from './file-list';
import { CataloguesApiService } from '../../services/catalogues-api';
import { ConfirmDelete } from '../confirm-delete';
import { Queue } from '../../utils/queue';
import { QueueVisualiser } from './queue-visualiser';

const StyledContainer = styled.div`
	margin: 2rem auto;
	max-width: 1600px;
	background: #fff;
	overflow: hidden;

	.header {
		display: flex;
		flex-wrap: wrap;
	}

	.current-folder {
		flex: 2;
		background-color: #24305e;
		padding: .5rem;
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
		display: flex;
		padding: .5rem;
		width: 100%;
		box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;

		.left {
			flex: 1;
		}
	}

	.select-all {
		margin-right: 1rem;
	}

	.filesystem-container {
		display: flex;
	}

	.folders-menu {
		padding: 1rem;
		min-width: 200px;
		max-width: 30%;
		max-height: calc(100vh - 16rem);
		background-color: #202228;
		box-shadow: rgb(0 0 0 / 12%) 1px 1px 3px, rgb(0 0 0 / 24%) 1px 1px 2px;
    overflow: auto;

		> ul {
			padding: 0;
		}
	}

	.files-view {
		flex: 1;
		max-height: calc(100vh - 16rem);
    overflow: auto;
	}
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
	const { isInternal } = useConfig();
	const [currentFolders, setCurrentFolders] = useState<ICurrentFolder[]>([]);
	const [selectedFiles, setSelectedFiles] = useState<(IFile | IEnrichedFile)[]>([]);
	const [shownFile, setShownFile] = useState<IFile | IEnrichedFile>();
	const resetShownFile = (): void => setShownFile(null);
	const queue = useRef(new Queue<'sync' | 'upload'>())

	const [isEditing, setIsEditing] = useState(false);
	
	const startEditing = (): void => setIsEditing(true);
	const finishEditing = (): void => setIsEditing(false);

	const [isUploading, setIsUploading] = useState(false);
	const [isSyncing, setIsSyncing] = useState(false);
	const [allSelected, setAllSelected] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const isSelecting = selectedFiles.length > 0;

	const [view, setView] = useState<IView>(() => {
		return (localStorage.getItem('file-view') as IView) || 'table';
	});
	const [isQueueOpen, setIsQueueOpen] = useState(false);

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

		const callId = await CataloguesApiService.sync();
		queue.current.push({ id: callId, label: 'Sincronizzazione', type: 'sync' });

		CataloguesApiService.pollSyncStatus(callId, (status) => queue.current?.update?.(callId, status));
		setIsSyncing(false);
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

	const deleteFiles = async (): Promise<void> => {
		const promises = selectedFiles.map(file => CataloguesApiService.deleteCatalogue(file.id));

		try {
			await Promise.all(promises);

			setSelectedFiles([]);
			setIsDeleting(false);
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<CurrentFolderContext.Provider value={{currentFolders, setCurrentFolder, toggleSelectedFolders}}>
			<CataloguesContext.Provider value={{categoriesLookup}}>
				<SelectedContext.Provider value={{ files: selectedFiles, selectFile: toggleSelectedFile, startEditing }}>
					{queue.current && <QueueVisualiser queue={queue.current} isOpen={isQueueOpen} close={(): void => setIsQueueOpen(false)} />}
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
								<div className="left">
									<Checkbox className="select-all" checked={allSelected} onChange={toggleSelectAll} label={allSelected ? 'Deseleziona tutti' : 'Seleziona tutti'} />
									{isSelecting && <Button onClick={startEditing} disabled={selectedFiles.length === 0} icon={Pencil} isExpanding>Modifica file</Button>}
									{isSelecting && <Button onClick={(): void => setIsDeleting(true)} disabled={selectedFiles.length === 0} icon={Trash} ghost isExpanding>Elimina file</Button>}
								</div>
								<div className="right">
									{isInternal && <Button icon={SyncIcon} onClick={syncServer} disabled={isSyncing} ghost isExpanding>Sincronizza</Button>}
									{isInternal && <Button icon={UploadIcon} onClick={(): void => setIsUploading(true)} isExpanding>Carica file</Button>}
									{/* <Button onClick={toggleView} ghost icon={view === 'grid' ? ListIcon : GridIcon} isExpanding>
										{view === 'grid' ? 'Tabella' : 'Griglia'}
									</Button> */}
									<Button
										onClick={(): void => setIsQueueOpen(!isQueueOpen)}
										icon={MenuIcon}
									>
										{`Coda (${Object.keys(queue.current?.queue || {}).length})`}
									</Button>
								</div>
							</div>
						</div>
						<div className="filesystem-container">
							{!isSearching && (
								<div className="folders-menu">
									<SubFolder folder={homeFolder} onSelect={setCurrentFolder} onToggle={toggleSelectedFolders} isRoot />
								</div>
							)}
							<FileList files={shownFiles} viewFile={setShownFile} view={view} className="files-view" />
						</div>
					</StyledContainer>
					{shownFile && <PdfViewer file={shownFile} closeModal={resetShownFile} />}
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
					{isDeleting && (
						<Modal isOpen={isDeleting} closeModal={(): void => setIsDeleting(false)} className="modal-small">
							<>
								<h2>Confermi di voler eliminare questi {selectedFiles.length} file?</h2>
								<ConfirmDelete
									onConfirm={deleteFiles}
									onCancel={(): void => setIsDeleting(false)}
									warningMessage="Questa operazione non puó essere annullata"
									list={selectedFiles.map(file => file.label || file.filename)}
								/>
							</>
						</Modal>
					)}
					{isInternal && (
						<Modal isOpen={isUploading} closeModal={(): void => setIsUploading(false)} className="modal-small">
							<>
								<h2>Carica file</h2>
								<UploadCataloguesForm
									selectedCategory={currentFolders.length === 1 ? currentFolders[0].id : ''}
									onSave={(): void => setIsUploading(false)}
									queue={queue.current}
								/>
							</>
						</Modal>
					)}
				</SelectedContext.Provider>
			</CataloguesContext.Provider>
		</CurrentFolderContext.Provider>
	)
}