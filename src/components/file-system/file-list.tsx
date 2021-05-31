import React from 'react';

import { File } from './file';
import { IFile } from '../../services/firebase/db';
import { IEnrichedFile } from '../../utils/file-system';
import styled from '@emotion/styled';

interface IFileListProps {
	files: (IFile | IEnrichedFile)[];
	onFileDoubleClick: (file: IFile | IEnrichedFile) => void;
	view: IView;
}

const StyledDivContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	padding: 1rem;

	> div {
		text-align: center;
	}

	a {
		display: block;
	}

	svg {
		display: block;
		margin: 0 auto;
		font-size: 3rem;
	}
`;

const StyledTableContainer = styled.div`
	> div {
		position: relative;
		padding: .5rem;

		&:nth-of-type(even) {
			background-color: rgba(0,0,0,.25);
		}
	}

	button {
		width: 100%;
		text-align: left;
		font-size: 1rem;
	}

	svg {
		margin-right: .5rem;
		font-size: 1rem;
	}
`;

export type IView = 'table' | 'grid';

const containerMap = {
	table: StyledTableContainer,
	grid: StyledDivContainer,
}

export const FileList: React.FC<IFileListProps> = ({ view, files, onFileDoubleClick }) => {
	if (files.length === 0) {
		return <p>Non ci sono file qui</p>;
	}
	
	const Container = containerMap[view];

	return (
		<Container>
			{files.map(
				(file) => 
					<File
						key={file.id}
						file={file}
						onFileDoubleClick={onFileDoubleClick}
					/>
				)
			}
		</Container>
	)
}