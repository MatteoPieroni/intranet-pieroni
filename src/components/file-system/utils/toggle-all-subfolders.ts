import { ICategoryWithSubfolders } from "../../../utils/file-system";
import { ICurrentFolder } from "../file-system";

const flattenSubFolders: (folder: ICategoryWithSubfolders) => ICurrentFolder[] = (folder) => {
	const subfolders = Object.values(folder.subfolders || {});
	const flattenedSubfolders = subfolders.map(flattenSubFolders);

	return [
		folder,
		...flattenedSubfolders.flat(),
	];
};

export const toggleAllSubfolders: (currentFolders: ICurrentFolder[], newFolder: ICategoryWithSubfolders) => ICurrentFolder[] =
	(currentFolders, newFolder) => {
		const isParentFolderActive = currentFolders.some(fold => fold.id === newFolder.id);

		// loop through all subfolders
		const allSubfolders = flattenSubFolders(newFolder);

		const newFolders = allSubfolders.reduce((acc, currentFolder) => {
			const [current, toBeAdded] = acc;
			const folderIsSelected = currentFolders.some(currentFolders => currentFolders.id === currentFolder.id);

			// if the parent folder isn't in the list (so we are adding it)
			if (!isParentFolderActive) {
				// and the current folder is already in the list
				if (folderIsSelected) {
					// leave it in the list
					return acc;
				}

				// if the current folder isn't in the list
				// add it
				return [current, [...toBeAdded, currentFolder]];
			}

			// if the parent folder is in the list (so we are taking it out)
			// and the current folder is not
			if (!folderIsSelected) {
				// do not add it
				return acc;
			}

			// if the current folder is in the list
			// take the current folder out
			const newCurrent = current.filter(fold => fold.id !== currentFolder.id);

			return [[...newCurrent], toBeAdded];
		}, [currentFolders, []]);

		return newFolders.flat();
	};