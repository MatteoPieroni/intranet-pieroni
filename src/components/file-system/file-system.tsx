import styled from '@emotion/styled';
import React, { useMemo, useState } from 'react';
import { IFile, IFolder } from '../../services/firebase/types';
import { organiseData } from '../../utils/file-system';
import { File } from './file';
import { SubFolder } from './subfolder';

interface IFileSystemProps {
	files: IFile[];
	folders: IFolder[];
}

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

export const FileSystem: React.FC<IFileSystemProps> = ({ files, folders }) => {
	const [currentFolder, setCurrentFolder] = useState('home');

	const organisedFilesystem = useMemo(() => {
		const organisedFiles = organiseData(folders, files);

		return {
			organisedFiles,
			organisedFolders: Object.keys(organisedFiles).map(folder => ({
				name: organisedFiles[folder].name,
				id: folder,
			})),
		}
	}, [folders, files]);

	const shownFiles = organisedFilesystem.organisedFiles[currentFolder];
	const displayedFolder = currentFolder === 'home' ? 'Home' : `Home/${organisedFilesystem.organisedFiles[currentFolder].name}`

	return (
		<StyledContainer>
			<div className="current-folder">
				{displayedFolder}
			</div>
			<div className="filesystem-container">
				<div className="folders-menu">
					<ul>
						{organisedFilesystem.organisedFolders.map(folder => (
							<li key={folder.id}>
								<button onClick={(): void => setCurrentFolder(folder.id)}>{folder.name}</button>
							</li>
						))}
					</ul>
				</div>
				<div className="files-folder">
					{shownFiles ? (
						<>
							{shownFiles.subfolders && Object.keys(shownFiles.subfolders).map((subfolder) => (
								<SubFolder
									key={shownFiles.subfolders[subfolder].name}
									folder={shownFiles.subfolders[subfolder]}
									onSelect={setCurrentFolder}
								/>
							))}
							{shownFiles.files.map((file) => <File key={file.name} file={file} />)}
						</>
					) : (
						<p>Non ci sono file qui</p>
					)}
				</div>
			</div>
		</StyledContainer>
	)
}