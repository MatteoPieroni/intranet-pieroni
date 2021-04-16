import styled from '@emotion/styled';
import React, { createContext, useContext, useMemo, useState } from 'react';
import { IOrganisedData } from '../../utils/file-system';
import { File } from './file';
import { FoldersTree } from './folders-tree';

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

interface ICurrentFolderContext {
	currentFolder: {
		id: string;
		label: string;
	};
	setCurrentFolder: (folder: {
		id: string;
		label: string;
	}) => void;
}

const CurrentFolderContext = createContext<Partial<ICurrentFolderContext>>({});
export const useCurrentFolder = (): Partial<ICurrentFolderContext> => useContext(CurrentFolderContext);

export const FileSystem: React.FC<IOrganisedData> = ({ files, categories }) => {
	const [currentFolder, setCurrentFolder] = useState<{
		id: string;
		label: string;
	}>();

	const allFiles = useMemo(() => {
		if (!files) {
			return;
		}

		const allArrays = Object.values(files);
		return allArrays.flat();
	}, [files]);
	const shownFiles = currentFolder ? files[currentFolder.id] : allFiles;
	const displayedFolder = currentFolder?.id ? currentFolder.label: 'Home';

	return (
		<CurrentFolderContext.Provider value={{currentFolder, setCurrentFolder}}>
			<StyledContainer>
				<div className="current-folder">
					{displayedFolder}
				</div>
				<div className="filesystem-container">
					<div className="folders-menu">
						<FoldersTree folders={categories} onSelect={setCurrentFolder} isRoot />
					</div>
					<div className="files-folder">
						{shownFiles ? (
								Object.values(shownFiles).map((file) => <File key={file.id} file={file} />)
						) : (
							<p>Non ci sono file qui</p>
						)}
					</div>
				</div>
			</StyledContainer>
		</CurrentFolderContext.Provider>
	)
}