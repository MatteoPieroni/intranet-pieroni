import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Item, Menu, useContextMenu } from 'react-contexify';

import { CataloguesService, IFile } from '../../services/firebase/db';
import { Icon } from '../icons';

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

	const editFile = async (): Promise<void> => {
		setIsEditing(true);

		try {
			await CataloguesService.renameCatalogue('1', file);
		} catch (e) {
			console.error(e);
		} finally {
			setIsEditing(false);
		}
	}

	return (
	<StyledFile>
		<a href={`http://192.168.1.14/test/${file.filename}`} target="_blank" rel="noreferrer" onContextMenu={show}>
			<Icon.PDFFile aria-hidden />
			{file.label}
		</a>
		<Menu id={file.id}>
			<Item onClick={editFile} disabled={isEditing}>Rinomina catalogo</Item>
		</Menu>
	</StyledFile>
)
};
