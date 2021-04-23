import { IFile, ICategory } from "../../services/firebase/db";

interface ICategoryWithFileCount extends ICategory {
	fileCount: number;
}

export interface ICategoryWithSubfolders extends ICategoryWithFileCount {
	subfolders: IOrganisedCategoriesGeneric<ICategoryWithSubfolders> | null;
}

export interface IOrganisedCategoriesGeneric<T> {
	uncategorised?: T;
	[key: string]: T;
}

export interface IOrganisedFiles {
	uncategorised: IFile[];
	[key: string]: IFile[];
}

export type IOrganisedCategories = IOrganisedCategoriesGeneric<ICategoryWithSubfolders>;

export interface IOrganisedData {
	files: IOrganisedFiles;
	categories: IOrganisedCategories;
}

// This function is used to check for a category at the subfolders levels
const transverseAndPlace: (tree: IOrganisedCategoriesGeneric<ICategoryWithSubfolders>, current: ICategoryWithFileCount) => IOrganisedCategoriesGeneric<ICategoryWithSubfolders> = (tree, { parent, ...current }) => {
	// if at the current level we find the parent add the current category to its subfolders
	if (tree[parent]) {
		tree[parent].subfolders = {
			...tree[parent].subfolders,
			[current.id]: {
				...current,
				subfolders: null,
			}
		}

		return tree;
	}

	// else, for each branch in the current tree
	for (const branchKey in tree) {
		// it it has subfolders
		if (tree[branchKey].subfolders) {
			// transverse those subfolders
			transverseAndPlace(tree[branchKey].subfolders, { parent, ...current });
		}
	}
}

const uncategorised: ICategoryWithSubfolders = {
	id: 'uncategorised',
	label: 'Senza categoria',
	parent: '',
	depth: 0,
	fileCount: 0,
	subfolders: null,
}

export const organiseFolders: (categories: ICategoryWithFileCount[]) => IOrganisedCategoriesGeneric<ICategoryWithSubfolders> = (categories) => {
	// create a lookup table with each category
	// it must include the uncategorised value to make sure we catch any "loose" files
	const orderedTree: IOrganisedCategoriesGeneric<ICategoryWithSubfolders> = {
		uncategorised,
	};
	// order the categories by depth
	const orderedCategories = categories.sort((curr, next) => curr.depth - next.depth);

	// for each ordered category
	orderedCategories.forEach(category => {
		const { parent, ...cat } = category;

		// if there is no parent add it to the root level
		if (!parent) {
			orderedTree[cat.id] = {
				...cat,
				subfolders: null,
			};

			return;
		}

		// else check the subfolders and place it there
		transverseAndPlace(orderedTree, category);
	});

	return orderedTree;
}

export const organiseFiles: (files: IFile[]) => IOrganisedFiles = (files) => {
	const fileList: IOrganisedFiles = {
		uncategorised: [],
	};

	// for each file
	files.forEach(file => {
		if (!file.categoriesId) {
			fileList.uncategorised.push(file);
			return;
		}
		// loop through categories
		file.categoriesId.forEach(category => {
			// add the file to each category id in the final object
			fileList[category] = [
				...(fileList[category] || []),
				file,
			];
		});
	});

	return fileList;
}

export const organiseData: (categories: ICategory[], files: IFile[]) => IOrganisedData =
	(categories, files) => {
		// create a lookup table of all the categories
		const categoriesLookup: IOrganisedCategoriesGeneric<ICategoryWithFileCount> = categories
			.reduce((acc, current) => ({
				...acc,
				[current.id]: {
					...current,
					fileCount: 0,
				},
			}), {});
		// add the uncategorised cat to make sure we catch all "loose" files
		categoriesLookup.uncategorised = uncategorised;

		// for each file
		files.forEach(({ categoriesId }) => {
			// if it has no categories
			if (!categoriesId) {
				// add it to the uncategorised file count in the lookup
				categoriesLookup.uncategorised.fileCount = categoriesLookup.uncategorised.fileCount + 1;
				return;
			}

			// otherwise add it to each category file count in the lookup table
			categoriesId.forEach(cat => {
				categoriesLookup[cat].fileCount = categoriesLookup[cat].fileCount + 1;
			});
		});

		const organisedFolders = organiseFolders(Object.values(categoriesLookup));
		const organisedFiles = organiseFiles(files);

		return {
			categories: organisedFolders,
			files: organisedFiles,
		}
	};