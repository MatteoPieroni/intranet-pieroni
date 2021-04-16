import React from 'react';
import { FileSystem } from '../components/file-system';
import { useCatalogues } from '../shared/hooks/useCatalogues';

export const CataloguesArchive: React.FC = () => {
	const filesystem = useCatalogues();

	const isLoading = !filesystem?.files || !filesystem?.categories;

	return (
		isLoading ? (
			<div>Loading</div>
		) : (
			<FileSystem {...filesystem} />
		)
	)
}