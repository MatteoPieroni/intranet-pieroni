import { useEffect, useState } from 'react';

import { CataloguesService } from '../../services/firebase/db';
import { IOrganisedData } from '../../utils/file-system';

export const useCatalogues: () => IOrganisedData = () => {
	const [files, setFiles] = useState<IOrganisedData>();

	useEffect(() => {
		const unListenToFiles = CataloguesService.listen(setFiles);

		return unListenToFiles;
	}, []);

	return files;
}