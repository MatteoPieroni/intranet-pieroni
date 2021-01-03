import { IFile, IFolder } from "../../services/firebase/types";

interface IOrganisedFolders {
	[key: string]: {
		name: string;
		id: string;
	};
}
interface IOrganisedData {
	[key: string]: {
		name: string;
		files: IFile[];
		subfolders?: IOrganisedFolders;
	};
}

const homeFolder: {
	name: string;
	files: IFile[];
	subfolders: IOrganisedFolders;
} = {
	name: 'Home',
	files: [],
	subfolders: {},
}

export const organiseData: (folders: IFolder[], files: IFile[]) => IOrganisedData = (folders, files) => {
	const organisedFolders: IOrganisedFolders = folders.reduce((acc, folder) => ({
		...acc,
		...(folder && 
			{
				[folder.id]: {
					name: folder.name,
					id: folder.id,
				}
			}
		)
	}), {});

	const organisedHome = {
		...homeFolder,
		subfolders: organisedFolders
	}

	return files.reduce((acc: IOrganisedData, file) => {
		if (file.folder) {
			return {
				...acc,
				[file.folder]: {
					name: organisedFolders[file.folder].name,
					files: [
						...(acc[file.folder]?.files || []),
						file,
					],
				}
			}
		}

		return {
			...acc,
			home: {
				...acc.home,
				files: [
					...(acc.home?.files || []),
					file,
				],
			}
		}
	},
	// start with the home data already in
	{
		home: organisedHome,
	});
}