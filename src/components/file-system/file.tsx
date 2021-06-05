import React, { KeyboardEventHandler, MouseEventHandler, useMemo } from 'react';
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
import { IView } from './file-list';
import { formatBytes } from './utils/bytes-size';

interface IFileProps {
	file: IFile | IEnrichedFile;
	viewFile: (file: IFile | IEnrichedFile) => void;
	view: IView;
}

const StyledFile = styled.div<{ isSelected: boolean }>`
	${(props): SerializedStyles => props.isSelected && css`
		background: red;
		
		&.container:nth-of-type(even) {
			background-color: rgba(255,0,0,.25);
		}
	`}
`;

export const File: React.FC<IFileProps> = ({ file, viewFile, view }) => {
	const { isInternal } = useConfig();
	const { show } = useContextMenu({ id: file.id });
	const { startEditing, selectFile, files } = useSelected();

	const isSelected = useMemo(() => files.some(selectedFile => selectedFile.id === file.id), [files, file]);

	const date = useMemo(() => `${file.createdAt.getDate()}-${file.createdAt.getMonth()}-${file.createdAt.getFullYear()}`, [file.createdAt]);
	const dimension = useMemo(() => formatBytes(file.dimension), [file.dimension]);

	const handleDoubleClick = async (): Promise<void> => {
		if (isInternal) {
			viewFile(file);
			return;
		}

		const url = await getFileDownloadUrl(file.storeUrl);
		download(url, file.filename);
	}

	const handleKeyboard: KeyboardEventHandler = (event) => {
		if (event.key === 'Enter') {
			handleDoubleClick();
			return;
		}

		if (event.key === ' ') {
			selectFile(file);
		}
	}

	const handleFileClick: MouseEventHandler = (event): void => {
		selectFile(file);
	}
	
	const handleContext = (event: TriggerEvent, params?: Pick<ContextMenuParams, "id" | "position" | "props">): void => {
		if (!isSelected) {
			selectFile(file);
		}

		show(event, params);
	}

	if (view === 'table') {
		return (
			<tr>
				<td>
					<button
						onContextMenu={handleContext}
						onMouseUp={handleFileClick}
						onDoubleClick={handleDoubleClick}
						onKeyUp={handleKeyboard}
					>
						{file.label}
					</button>
				</td>
				<td>
					{date}
				</td>
				<td>
					{dimension}
				</td>

				<Menu id={file.id}>
					<Item onClick={handleDoubleClick}>{isInternal ? 'Visualizza' : 'Scarica'}</Item>
					<Item onClick={startEditing}>Modifica catalogo</Item>
				</Menu>
			</tr>
		)
	}

	return (
		<StyledFile isSelected={isSelected} className="container">
			<button
				onContextMenu={handleContext}
				onMouseUp={handleFileClick}
				onDoubleClick={handleDoubleClick}
				onKeyUp={handleKeyboard}
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
