import React from 'react';

import { File } from './file';
import { IFile } from '../../services/firebase/db';
import { IEnrichedFile } from '../../utils/file-system';
import styled from '@emotion/styled';
import { CheckboxCheckedIcon } from '../icons/Icon';
import { HiddenContent } from '../hidden-content/hidden-content';

interface IFileListProps {
	files: (IFile | IEnrichedFile)[];
	viewFile: (file: IFile | IEnrichedFile) => void;
	view: IView;
	className?: string;
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
	table {
		width: 100%;
	}

	th {
		padding: .5rem;
		border-bottom: 1px solid #98a4b5;
		text-align: left;
		font-weight: bold;
	}
`;

export type IView = 'table' | 'grid';

const containerMap = {
	table: StyledTableContainer,
	grid: StyledDivContainer,
}

export const FileList: React.FC<IFileListProps> = ({ view, files, viewFile, className}) => {
	if (files.length === 0) {
		return <p>Non ci sono file qui</p>;
	}
	
	const Container = containerMap[view];

	if (view === 'table') {
		return (
			<Container className={className}>
				<table>
					<thead>
						<tr>
							<th>
								<CheckboxCheckedIcon aria-hidden />
								<HiddenContent>Selezionato</HiddenContent>
							</th>
							<th>
								Nome
							</th>
							<th>
								Data
							</th>
							<th>
								Dimensione
							</th>
						</tr>
					</thead>
					<tbody>
						{files.map(
							(file) => 
								<File
									key={file.id}
									file={file}
									viewFile={viewFile}
									view={view}
								/>
							)
						}
					</tbody>
				</table>
			</Container>
		);
	}

	return (
		<Container className={className}>
			{files.map(
				(file) => 
					<File
						key={file.id}
						file={file}
						viewFile={viewFile}
						view={view}
					/>
				)
			}
		</Container>
	)
}