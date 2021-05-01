import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Item, Menu, useContextMenu } from 'react-contexify';

import { IFile } from '../../services/firebase/db';
import { Icon } from '../icons';
import { Modal } from '../modal';
import { CataloguesForm } from '../forms/catalogues-form';
import { IEnrichedFile } from '../../utils/file-system';

interface IFileProps {
	file: IFile | IEnrichedFile;
	onFileDoubleClick: (file: IFile | IEnrichedFile) => void;
}

const StyledFile = styled.div`
	text-align: center;

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
	const [isEditing, setIsEditing] = useState(false);

	const startEditing = (): void => setIsEditing(true);
	const finishEditing = (): void => setIsEditing(false);

	return (
	<StyledFile>
		<button
			onContextMenu={show}
			onDoubleClick={(): void => onFileDoubleClick(file)}
		>
			<Icon.PDFFile aria-hidden />
			{file.label}
		</button>
		<Menu id={file.id}>
			<Item onClick={startEditing} disabled={isEditing}>Modifica catalogo</Item>
		</Menu>
		<Modal isOpen={isEditing} closeModal={finishEditing} className="modal-small">
			<h2>Modifica catalogo</h2>
			<CataloguesForm file={file} onSave={finishEditing} />
		</Modal>
	</StyledFile>
)
};
