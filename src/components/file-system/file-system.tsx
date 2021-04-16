import styled from '@emotion/styled';
import React, { useMemo, useState } from 'react';
import { IOrganisedData, organiseData } from '../../utils/file-system';
import { File } from './file';
import { FoldersTree, SubFolder } from './folders-tree';

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
  	grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
	padding: 1rem;
	}

	.folders-menu {

	}

	.files-folder {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr;

	}
`;

export const FileSystem: React.FC<IOrganisedData> = ({ files, categories }) => {
	const [currentFolder, setCurrentFolder] = useState('');

	const shownFiles = currentFolder ? files[currentFolder] : files;
	const displayedFolder = currentFolder === 'home' ? 'Home' : `Home/${categories}`

	return (
		<StyledContainer>
			<div className="current-folder">
				{displayedFolder}
			</div>
			<div className="filesystem-container">
				<div className="folders-menu">
					<FoldersTree folders={categories} onSelect={setCurrentFolder} />
					{/* <ul>
						{organisedFilesystem.organisedFolders.map(folder => (
							<li key={folder.id}>
								<button onClick={(): void => setCurrentFolder(folder.id)}>{folder.name}</button>
							</li>
						))}
					</ul> */}
				</div>
				<div className="files-folder">
					{shownFiles ? (
						<>
							{/* {shownFiles.subfolders && Object.keys(shownFiles.subfolders).map((subfolder) => (
								<SubFolder
									key={shownFiles.subfolders[subfolder].name}
									folder={shownFiles.subfolders[subfolder]}
									onSelect={setCurrentFolder}
								/>
							))} */}
							{Object.values(shownFiles).map((file) => <File key={file.label} file={file} />)}
						</>
					) : (
						<p>Non ci sono file qui</p>
					)}
				</div>
			</div>
		</StyledContainer>
	)
}