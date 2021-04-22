import { IFile, ICategory } from "../../services/firebase/db";

interface ICategoryWithFileCount extends ICategory {
	fileCount: number;
}

export interface ICategoryWithSubfolders extends ICategoryWithFileCount {
	subfolders: IOrganisedCategoriesGeneric<ICategoryWithSubfolders> | null;
}

export interface IOrganisedCategoriesGeneric<T> {
	[key: string]: T;
}

export interface IOrganisedFiles {
	[key: string]: IFile[];
}

export type IOrganisedCategories = IOrganisedCategoriesGeneric<ICategoryWithSubfolders>;

export interface IOrganisedData {
	files: IOrganisedFiles;
	categories: IOrganisedCategories;
}

const transverseAndPlace: (tree: IOrganisedCategoriesGeneric<ICategoryWithSubfolders>, current: ICategoryWithFileCount) => IOrganisedCategoriesGeneric<ICategoryWithSubfolders> = (tree, { parent, ...current }) => {
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

	for (const branchKey in tree) {
		if (tree[branchKey].subfolders) {
			transverseAndPlace(tree[branchKey].subfolders, { parent, ...current });
		}
	}
}

export const organiseFolders: (categories: ICategoryWithFileCount[]) => IOrganisedCategoriesGeneric<ICategoryWithSubfolders> = (categories) => {
	const orderedTree: IOrganisedCategoriesGeneric<ICategoryWithSubfolders> = {};
	const orderedCategories = categories.sort((curr, next) => curr.depth - next.depth);

	orderedCategories.forEach(category => {
		const { parent, ...cat } = category;

		if (!parent) {
			orderedTree[cat.id] = {
				...cat,
				subfolders: null,
			};

			return;
		}

		transverseAndPlace(orderedTree, category);
	});

	return orderedTree;
}

export const organiseFiles: (files: IFile[]) => IOrganisedFiles = (files) => {
	const fileList: IOrganisedFiles = {};

	files.forEach(file => {
		file.categoriesId.forEach(category => {
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
		const categoriesLookup: IOrganisedCategoriesGeneric<ICategoryWithFileCount> = categories
			.reduce((acc, current) => ({
				...acc,
				[current.id]: {
					...current,
					fileCount: 0,
				},
			}), {});

		files.forEach(({ categoriesId }) => {
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