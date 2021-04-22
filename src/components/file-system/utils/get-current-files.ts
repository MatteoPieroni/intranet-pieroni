import { IFile } from "../../../services/firebase/db";
import { IOrganisedFiles } from "../../../utils/file-system";
import { ICurrentFolder } from "../file-system";

export const getCurrentFiles: (folderSelection: ICurrentFolder[], file: IOrganisedFiles) => IFile[] = (folderSelection, file) => {
	const allFiles = folderSelection.reduce((acc, folder) => {
		if (!file[folder.id]) {
			return acc;
		}

		return [
			...acc,
			file[folder.id]
		]
	}, []);

	return allFiles.flat();
}