import React from 'react';
import styled from '@emotion/styled';

import { IFile } from '../../services/firebase/db';
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

export const File: React.FC<IFileProps> = ({ file }) => (
	<StyledFile>
		<a href={`http://192.168.1.14/test/${file.filename}`} target="_blank" rel="noreferrer">
			<Icon.PDFFile aria-hidden />
			{file.label}
		</a>
	</StyledFile>
);
