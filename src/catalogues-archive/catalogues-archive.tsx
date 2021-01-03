import React, { useEffect, useState } from 'react';
import { FileSystem } from '../components/file-system';
import { CataloguesService } from '../services/firebase/db/catalogues-service';
import { IFile, IFolder } from '../services/firebase/types';

export const CataloguesArchive: React.FC = () => {
	const [catalogues, setCatalogues] = useState<IFile[]>([]);
	const [folders, setFolders] = useState<IFolder[]>([]);
	
	const isLoading = catalogues.length === 0 || folders.length === 0;

  useEffect(() => {
    const unListenToFilesystem = CataloguesService.listenToFilesystem(({ catalogues: newCatalogues, folders: newFolders }) => {
			// TODO: Handle error
      // if (!hasError) {
				if (newCatalogues) {
					setCatalogues(newCatalogues);
				}

				if (newFolders) {
					setFolders(newFolders);
				}
      // }
    });

    return unListenToFilesystem;
	}, []);

	return (
		isLoading ? (
			<div>Loading</div>
		) : (
			<FileSystem files={catalogues} folders={folders} />
		)
	)
}