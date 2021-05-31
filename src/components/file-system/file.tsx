import React, { useMemo } from 'react';
import { css, SerializedStyles } from '@emotion/core';
import styled from '@emotion/styled';
import { ContextMenuParams, Item, Menu, TriggerEvent, useContextMenu } from 'react-contexify';

import { IFile } from '../../services/firebase/db';
import { Icon } from '../icons';
import { IEnrichedFile } from '../../utils/file-system';
import { useSelected } from './file-system';
import { useConfig } from '../../shared/hooks';
import { getFileDownloadUrl } from '../../services/firebase/storage';
import { download } from './utils/browser-download';

interface IFileProps {
	file: IFile | IEnrichedFile;
	viewFile: (file: IFile | IEnrichedFile) => void;
}

const StyledFile = styled.div<{ isSelected: boolean }>`
	${(props): SerializedStyles => props.isSelected && css`
		background: red;
		
		&.container:nth-of-type(even) {
			background-color: rgba(255,0,0,.25);
		}
	`}
`;

export const File: React.FC<IFileProps> = ({ file, viewFile }) => {
	const { isInternal } = useConfig();
	const { show } = useContextMenu({ id: file.id });
	const { startEditing, selectFile, files } = useSelected();

	const isSelected = useMemo(() => files.some(selectedFile => selectedFile.id === file.id), [files, file]);

	const handleFileClick = (event: TriggerEvent, file: IFile | IEnrichedFile): void => {
		selectFile(file);
	}

	const handleDoubleClick = async (): Promise<void> => {
		if (isInternal) {
			viewFile(file);
			return;
		}

		const url = await getFileDownloadUrl(file.storeUrl);
		download(url, file.filename);
	}
	
	const handleContext = (event: TriggerEvent, params?: Pick<ContextMenuParams, "id" | "position" | "props">): void => {
		if (!isSelected) {
			selectFile(file);
		}

		show(event, params);
	}

	return (
	<StyledFile isSelected={isSelected} className="container">
		<button
			onContextMenu={handleContext}
			onClick={(e): void => handleFileClick(e, file)}
			onDoubleClick={handleDoubleClick}
		>
			<Icon.PDFFile aria-hidden />
			{file.label}
		</button>
		<Menu id={file.id}>
			<Item onClick={handleDoubleClick}>{isInternal ? 'Visualizza' : 'Scarica'}</Item>
			<Item onClick={startEditing}>Modifica catalogo</Item>
		</Menu>
	</StyledFile>
)
};
