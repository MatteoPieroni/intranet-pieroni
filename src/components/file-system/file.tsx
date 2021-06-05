import React, { KeyboardEventHandler, useMemo } from 'react';
import { SerializedStyles } from '@emotion/core';
import css from '@emotion/css';
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
import { Checkbox } from '../inputs/checkbox';

interface IFileProps {
	file: IFile | IEnrichedFile;
	viewFile: (file: IFile | IEnrichedFile) => void;
	view: IView;
}

type StyledProps = {
	isSelected: boolean;
}

const StyledFile = styled.div<StyledProps>`
	${(props): SerializedStyles => props.isSelected && css`
		background: red;
		
		&.container:nth-of-type(even) {
			background-color: rgba(255,0,0,.25);
		}
	`}
`;

const StyledRowFile = styled.tr<StyledProps>`
	td {
		position: relative;
		padding: .75rem;
		border-bottom: 1px solid #c6d4e8;
	}

	&:hover td {
		background-color: #c6d4e8;
		border-color: #98a4b5;
	}

	button {
		width: 100%;
		text-align: left;
		font-size: 1rem;
		cursor: pointer;
	}
`;

const checkboxStyles = (checked: boolean): SerializedStyles => css`
	&:after {
		border: 1px solid #d2d2d2;
    box-shadow: rgb(0 0 0 / 25%) 0px 0.0625em 0.0625em, rgb(0 0 0 / 25%) 0px 0.125em 0.5em, rgb(255 255 255 / 10%) 0px 0px 0px 1px inset;
	}

	${checked && css`
		&:focus-within {
			outline-color: #202228;
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

	const handleFileClick = (): void => {
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
			<StyledRowFile isSelected={isSelected}>
				<td>
					<Checkbox
						ariaLabelledBy={`nome-${file.id}`}
						checked={isSelected}
						onChange={handleFileClick}
						getStyles={checkboxStyles}
					/>
				</td>
				<td>
					<button
						onContextMenu={handleContext}
						onDoubleClick={handleDoubleClick}
						onKeyUp={handleKeyboard}
						id={`nome-${file.id}`}
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
			</StyledRowFile>
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
