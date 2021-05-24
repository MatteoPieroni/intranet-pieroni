import React, { createContext, useContext, useMemo, useState } from 'react';
import styled from '@emotion/styled';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

import { IFile } from '../../services/firebase/db';
import { useConfig, useSearch } from '../../shared/hooks';
import { ICategoriesLookup, ICategoryWithSubfolders, IEnrichedFile, IOrganisedData } from '../../utils/file-system';
import { File } from './file';
import { SubFolder } from './folders-tree';
import { getCurrentFiles } from './utils/get-current-files';
import { toggleAllSubfolders } from './utils/toggle-all-subfolders';
import { PdfViewer } from '../pdf-viewer';

const StyledContainer = styled.div`
	margin: 2rem auto;
	max-width: 80%;
	background: #fff;

	.current-folder {
		width: 100%;
		border: 2px solid black;
		padding: .5rem;
	}

	.filesystem-container {
		display: grid;
		grid-gap: 10px;
  		grid-template-columns: minmax(auto, 250px) 1fr;
	}

	.folders-menu {
		padding: 1rem;
		background-color: #202228;

		> ul {
			padding: 0;
		}
	}

	.files-folder {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr;
		padding: 1rem;
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

const baseHomeFolder = {
	id: '',
	label: 'Home',
	parent: '',
	depth: -1,
	fileCount: 0,
};

const CurrentFolderContext = createContext<Partial<ICurrentFolderContext>>({});
const CataloguesContext = createContext<ICataloguesContext>({} as ICataloguesContext);
export const useCurrentFolder = (): Partial<ICurrentFolderContext> => useContext(CurrentFolderContext);
export const useCatalogueUtilities = (): ICataloguesContext => useContext(CataloguesContext);

export const FileSystem: React.FC<IOrganisedData> = ({ files, categories, categoriesLookup, filesList }) => {
	const { isInternal, apiUrl } = useConfig();
	const [currentFolders, setCurrentFolders] = useState<ICurrentFolder[]>([]);
	const [shownFile, setShownFile] = useState<IFile | IEnrichedFile>();
	const shownUrl = shownFile ?
		isInternal ?
			`${apiUrl}/file/${shownFile.filename}` :
			shownFile.storeUrl :
		'';
	const resetShownFile = (): void => setShownFile(null);

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

	const setCurrentFolder = (folder: ICurrentFolder): void => folder.id ? setCurrentFolders([folder]) : setCurrentFolders([]);

	const toggleSelectedFolders = (folder: ICategoryWithSubfolders): void => {
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

	return (
		<CurrentFolderContext.Provider value={{currentFolders, setCurrentFolder, toggleSelectedFolders}}>
			<CataloguesContext.Provider value={{categoriesLookup}}>
				<StyledContainer>
					<div>
						<div className="current-folder">
							{displayedFolder()}
						</div>
						<div className="search-field">
							<input type="search" onChange={onSearch} />
						</div>
					</div>
					<div className="filesystem-container">
						{!isSearching && (
							<div className="folders-menu">
								<SubFolder folder={homeFolder} onSelect={setCurrentFolder} onToggle={toggleSelectedFolders} isRoot />
							</div>
						)}
						<div className="files-folder">
							{shownFiles.length > 0 ? (
									shownFiles.map((file) => <File
										key={file.id}
										file={file}
										onFileDoubleClick={setShownFile}
									/>)
							) : (
								<p>Non ci sono file qui</p>
							)}
						</div>
					</div>
				</StyledContainer>
				{shownFile && <PdfViewer url={shownUrl} closeModal={resetShownFile} />}
			</CataloguesContext.Provider>
		</CurrentFolderContext.Provider>
	)
}