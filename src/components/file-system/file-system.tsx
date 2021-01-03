import styled from '@emotion/styled';
import React, { useMemo, useState } from 'react';
import { IFile, IFolder } from '../../services/firebase/types';
import { organiseData } from '../../utils/file-system';

interface IFileSystemProps {
	files: IFile[];
	folders: IFolder[];
}

const StyledContainer = styled.div`
	display: grid;
	grid-template-columns: 20% 80%;
	margin: 2rem auto;
	padding: 1rem;
	max-width: 80%;
	background: #fff;

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

	const getHandleSelectFolder: (folder: string) => () => void = (folder) => (): void => setCurrentFolder(folder);
	const getHandleKeyboardSelectFolder: (folder: string) => (event: React.KeyboardEvent<HTMLButtonElement>) => void = 
		(folder) => (event): void => {
			if (event.key === 'Enter' || event.key === ' ') {
				setCurrentFolder(folder);
			}
		};

	return (
		<StyledContainer>
			<div className="folders-menu">
				<ul>
					{organisedFilesystem.organisedFolders.map(folder => (
						<li key={folder.id}>
							<button onClick={getHandleSelectFolder(folder.id)}>{folder.name}</button>
						</li>
					))}
				</ul>
			</div>
			<div className="files-folder">
				{shownFiles ? (
					<>
						{shownFiles.subfolders && Object.keys(shownFiles.subfolders).map((subfolder) => (
							<div key={subfolder}>
								<button
									onDoubleClick={getHandleSelectFolder(subfolder)}
									onKeyPress={getHandleKeyboardSelectFolder(subfolder)}
								>
									{shownFiles.subfolders[subfolder].name}
								</button>
							</div>
						))}
						{shownFiles.files.map((file) => (
							<div key={file.filename}><a href={`http://192.168.1.14/test/${file.filename}`} target="_blank" rel="noreferrer">{file.name}</a></div>
						))}
					</>
				) : (
					<p>Non ci sono file qui</p>
				)}
			</div>
		</StyledContainer>
	)
}