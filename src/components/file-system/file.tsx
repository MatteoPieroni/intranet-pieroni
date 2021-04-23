import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Item, Menu, useContextMenu } from 'react-contexify';

import { IFile } from '../../services/firebase/db';
import { Icon } from '../icons';
import { Modal } from '../modal';
import { CataloguesForm } from '../forms/catalogues-form';

interface IFileProps {
	file: IFile;
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

export const File: React.FC<IFileProps> = ({ file }) => {
	const { show } = useContextMenu({ id: file.id });
	const [isEditing, setIsEditing] = useState(false);

	const startEditing = (): void => setIsEditing(true);
	const finishEditing = (): void => setIsEditing(false);

	return (
	<StyledFile>
		<a href={`http://192.168.1.14/test/${file.filename}`} target="_blank" rel="noreferrer" onContextMenu={show}>
			<Icon.PDFFile aria-hidden />
			{file.label}
		</a>
		<Menu id={file.id}>
			<Item onClick={startEditing} disabled={isEditing}>Rinomina catalogo</Item>
		</Menu>
		<Modal isOpen={isEditing} closeModal={finishEditing}>
			<CataloguesForm file={file} onSave={finishEditing} />
		</Modal>
	</StyledFile>
)
};
