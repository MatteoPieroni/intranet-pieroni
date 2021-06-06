import React from 'react';
import { FileSystem } from '../file-system';
import { useCatalogues } from '../../shared/hooks/useCatalogues';
import { Loader } from '../loader';

export const CataloguesArchive: React.FC = () => {
	const filesystem = useCatalogues();

	const isLoading = !filesystem?.files || !filesystem?.categories;

	return (
		isLoading ? (
			<Loader />
		) : (
			<FileSystem {...filesystem} />
		)
	)
}