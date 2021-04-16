import { ICategoryWithSubfolders, IOrganisedCategoriesGeneric, organiseData, organiseFiles, organiseFolders } from './normaliser';

const cataloguesData = [
	{
		categoriesId: ['category-id-1'],
		filename: 'attachment.pdf',
		id: 'cat-id-1',
		label: 'test catalogue',
		storeUrl: 'https://test.it',
	},
	{
		categoriesId: ['category-id-3'],
		filename: 'attachment-1.pdf',
		id: 'cat-id-3',
		label: 'test catalogue 2',
		storeUrl: 'https://test.it',
	},
	{
		categoriesId: ['category-id-3', 'category-id-1', 'category-id-4'],
		filename: 'attachment-1.pdf',
		id: 'cat-id-3',
		label: 'test catalogue 2',
		storeUrl: 'https://test.it',
	},
];

const organisedCatalogues = {
	'category-id-1': [
		{
			categoriesId: ['category-id-1'],
			filename: 'attachment.pdf',
			id: 'cat-id-1',
			label: 'test catalogue',
			storeUrl: 'https://test.it',
		},
		{
			categoriesId: ['category-id-3', 'category-id-1', 'category-id-4'],
			filename: 'attachment-1.pdf',
			id: 'cat-id-3',
			label: 'test catalogue 2',
			storeUrl: 'https://test.it',
		},
	],
	'category-id-3': [
		{
			categoriesId: ['category-id-3'],
			filename: 'attachment-1.pdf',
			id: 'cat-id-3',
			label: 'test catalogue 2',
			storeUrl: 'https://test.it',
		},
		{
			categoriesId: ['category-id-3', 'category-id-1', 'category-id-4'],
			filename: 'attachment-1.pdf',
			id: 'cat-id-3',
			label: 'test catalogue 2',
			storeUrl: 'https://test.it',
		},
	],
	'category-id-4': [
		{
			categoriesId: ['category-id-3', 'category-id-1', 'category-id-4'],
			filename: 'attachment-1.pdf',
			id: 'cat-id-3',
			label: 'test catalogue 2',
			storeUrl: 'https://test.it',
		},
	],
};

const categoriesDataWithFileCount = [
	{
		id: 'category-id-1',
		label: 'Test Category',
		fileCount: 2,
		depth: 0,
	},
	{
		id: 'category-id-2',
		label: 'Test Category 2',
		fileCount: 1,
		depth: 0,
	},
	{
		id: 'category-id-5',
		label: 'Test Category 5',
		parent: 'category-id-4',
		fileCount: 3,
		depth: 2,
	},
	{
		id: 'category-id-3',
		label: 'Test Category 3',
		parent: 'category-id-1',
		fileCount: 2,
		depth: 1,
	},
	{
		id: 'category-id-4',
		label: 'Test Category 4',
		parent: 'category-id-2',
		fileCount: 10,
		depth: 1,
	},
];

const organisedCategoriesWithFileCount: IOrganisedCategoriesGeneric<ICategoryWithSubfolders> = {
	['category-id-1']: {
		id: 'category-id-1',
		depth: 0,
		fileCount: 2,
		label: 'Test Category',
		subfolders: {
			'category-id-3': {
				id: 'category-id-3',
				depth: 1,
				label: 'Test Category 3',
				fileCount: 2,
				subfolders: null,
			}
		}
	},
	['category-id-2']: {
		id: 'category-id-2',
		label: 'Test Category 2',
		fileCount: 1,
		depth: 0,
		subfolders: {
			'category-id-4': {
				id: 'category-id-4',
				label: 'Test Category 4',
				fileCount: 10,
				depth: 1,
				subfolders: {
					'category-id-5': {
						id: 'category-id-5',
						fileCount: 3,
						depth: 2,
						label: 'Test Category 5',
						subfolders: null,
					}
				},
			}
		},
	}
};

const categoriesData = [
	{
		id: 'category-id-1',
		label: 'Test Category',
		depth: 0,
	},
	{
		id: 'category-id-2',
		label: 'Test Category 2',
		depth: 0,
	},
	{
		id: 'category-id-5',
		label: 'Test Category 5',
		parent: 'category-id-4',
		depth: 2,
	},
	{
		id: 'category-id-3',
		label: 'Test Category 3',
		parent: 'category-id-1',
		depth: 1,
	},
	{
		id: 'category-id-4',
		label: 'Test Category 4',
		parent: 'category-id-2',
		depth: 1,
	},
];

const organisedCategories: IOrganisedCategoriesGeneric<ICategoryWithSubfolders> = {
	['category-id-1']: {
		id: 'category-id-1',
		depth: 0,
		fileCount: 2,
		label: 'Test Category',
		subfolders: {
			'category-id-3': {
				id: 'category-id-3',
				depth: 1,
				label: 'Test Category 3',
				fileCount: 2,
				subfolders: null,
			}
		}
	},
	['category-id-2']: {
		id: 'category-id-2',
		label: 'Test Category 2',
		fileCount: 0,
		depth: 0,
		subfolders: {
			'category-id-4': {
				id: 'category-id-4',
				label: 'Test Category 4',
				fileCount: 1,
				depth: 1,
				subfolders: {
					'category-id-5': {
						id: 'category-id-5',
						fileCount: 0,
						depth: 2,
						label: 'Test Category 5',
						subfolders: null,
					}
				},
			}
		},
	}
};

describe('organiseData', () => {
	describe('organiseFolders', () => {
		test('outputs a list of folders and subfolders', () => {
			expect(organiseFolders(categoriesDataWithFileCount)).toEqual(organisedCategoriesWithFileCount);
		});
	});
	describe('organiseFiles', () => {
		test('outputs a list of files divided by folder', () => {
			expect(organiseFiles(cataloguesData)).toEqual(organisedCatalogues);
		});
	});

	test('outputs a list of folders and a list of files, with the correct file count', () => {
		expect(organiseData(categoriesData, cataloguesData)).toEqual({ categories: organisedCategories, files: organisedCatalogues });
	});
});