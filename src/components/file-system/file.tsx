import React, { useMemo } from 'react';
import { css, SerializedStyles } from '@emotion/core';
import styled from '@emotion/styled';
import { Item, Menu, useContextMenu } from 'react-contexify';

import { IFile } from '../../services/firebase/db';
import { Icon } from '../icons';
import { IEnrichedFile } from '../../utils/file-system';
import { useSelected } from './file-system';

interface IFileProps {
	file: IFile | IEnrichedFile;
	onFileDoubleClick: (file: IFile | IEnrichedFile) => void;
}

const StyledFile = styled.div<{ isSelected: boolean }>`
	text-align: center;

	${(props): SerializedStyles => props.isSelected && css`
		background: red;
	`}

	a {
		display: block;
	}

	svg {
		display: block;
		margin: 0 auto;
		font-size: 3rem;
	}
`;

export const File: React.FC<IFileProps> = ({ file, onFileDoubleClick }) => {
	const { show } = useContextMenu({ id: file.id });
	const { startEditing, selectFile, files } = useSelected();

	const isSelected = useMemo(() => files.some(selectedFile => selectedFile.id === file.id), [files, file]);

	return (
	<StyledFile isSelected={isSelected}>
		<button
			onContextMenu={show}
			onClick={(): void => selectFile(file)}
			onDoubleClick={(): void => onFileDoubleClick(file)}
		>
			<Icon.PDFFile aria-hidden />
			{file.label}
		</button>
		<Menu id={file.id}>
			<Item onClick={startEditing}>Modifica catalogo</Item>
		</Menu>
	</StyledFile>
)
};
