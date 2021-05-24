import { IFile } from "../../../services/firebase/db";
import { IOrganisedFiles } from "../../../utils/file-system";
import { ICurrentFolder } from "../file-system";

export const getCurrentFiles: (folderSelection: ICurrentFolder[], fileLookup: IOrganisedFiles) => IFile[] = (folderSelection, fileLookup) => {
	const allFiles = folderSelection.reduce((acc, folder) => {
		if (!fileLookup[folder.id]) {
			return acc;
		}

		return [
			...acc,
			...fileLookup[folder.id]
		]
	}, []);

	const dedupedFiles = [...new Set(allFiles)] as IFile[];

	return dedupedFiles;
}