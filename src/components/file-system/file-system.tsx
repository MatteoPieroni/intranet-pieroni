import styled from '@emotion/styled';
import React, { createContext, useContext, useMemo, useState } from 'react';
import { IOrganisedData } from '../../utils/file-system';
import { File } from './file';
import { SubFolder } from './folders-tree';
import { getCurrentFiles } from './utils/get-current-files';

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
  	grid-template-columns: auto 1fr;
		padding: 1rem;
	}

	.folders-menu {
		> ul {
			padding: 0;
		}
	}

	.files-folder {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr;
	}
`;

export type ICurrentFolder = {
	id: string;
	label: string;
};

interface ICurrentFolderContext {
	currentFolders: ICurrentFolder[];
	setCurrentFolder: (folder: ICurrentFolder) => void;
	toggleSelectedFolder: (folder: ICurrentFolder) => void;
}

const baseHomeFolder = {
	id: '',
	label: 'Home',
	parent: '',
	depth: -1,
	fileCount: 0,
};

const CurrentFolderContext = createContext<Partial<ICurrentFolderContext>>({});
export const useCurrentFolder = (): Partial<ICurrentFolderContext> => useContext(CurrentFolderContext);

export const FileSystem: React.FC<IOrganisedData> = ({ files, categories }) => {
	const [currentFolders, setCurrentFolders] = useState<ICurrentFolder[]>([]);

	const allFiles = useMemo(() => {
		if (!files) {
			return;
		}

		const allArrays = Object.values(files);
		return allArrays.flat();
	}, [files]);
	const shownFiles = useMemo(() =>
		currentFolders.length > 0 ? getCurrentFiles(currentFolders, files) : allFiles, [currentFolders, files]);
	const displayedFolder = currentFolders.length > 0 ?
		currentFolders.length > 1 ?
			`${currentFolders.length} categorie` :
			currentFolders[0].label
		: 'Home';

	const homeFolder = useMemo(() => {
		return {
			...baseHomeFolder,
			subfolders: categories,
		}
	}, [categories]);

	const setCurrentFolder = (folder: ICurrentFolder): void => folder.id ? setCurrentFolders([folder]) : setCurrentFolders([]);

	const toggleSelectedFolder = (folder: ICurrentFolder): void => {
		const isPresent = currentFolders.some(currentFolders => currentFolders.id === folder.id);
		
		if (isPresent) {
			setCurrentFolders(currentFolders.filter(currentFolders => currentFolders.id !== folder.id));
			return;
		}

		setCurrentFolders([...currentFolders, folder]);
	};

	return (
		<CurrentFolderContext.Provider value={{currentFolders, setCurrentFolder, toggleSelectedFolder}}>
			<StyledContainer>
				<div className="current-folder">
					{displayedFolder}
				</div>
				<div className="filesystem-container">
					<div className="folders-menu">
						<SubFolder folder={homeFolder} onSelect={setCurrentFolder} onToggle={toggleSelectedFolder} isRoot />
					</div>
					<div className="files-folder">
						{shownFiles.length > 0 ? (
								shownFiles.map((file) => <File key={file.id} file={file} />)
						) : (
							<p>Non ci sono file qui</p>
						)}
					</div>
				</div>
			</StyledContainer>
		</CurrentFolderContext.Provider>
	)
}