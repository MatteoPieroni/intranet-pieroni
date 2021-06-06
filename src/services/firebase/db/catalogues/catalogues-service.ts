/* eslint-disable @typescript-eslint/camelcase */
import { IOrganisedData, organiseData } from "../../../../utils/file-system";
import { CancellableListener } from "../db";
import { IFile, ICategory, IDbFile, IFileChanges } from "../types";
import {
	ICatalogueListener,
	ICategoriesListener,
	listenToCatalogues,
	listenToCategories,
	addCategory,
	removeCategory,
	editCategory,
	editCatalogue as editCatalogueCourier,
} from "./catalogues-couriers";

type IFileListener = (fileSystem: IOrganisedData) => void;

interface IFilesConfig {
	apiUrl: string;
}

interface IFilesService {
	listenToCatalogues: (callback: (hasError: boolean, data?: IFile[]) => void, normaliser: (data: { [key: string]: IDbFile }) => IFile[]) => CancellableListener;
	listenToCategories: (callback: (hasError: boolean, data?: ICategory[]) => void) => CancellableListener;
	addCategory: (data: ICategory) => Promise<ICategory>;
	editCategory: (data: ICategory) => Promise<ICategory>;
	removeCategory: (id: string) => Promise<void>;
	editCatalogueCourier: (data: IDbFile) => Promise<IDbFile>;
}

export class CataloguesServiceClass {
	private listenToCatalogues: ICatalogueListener;
	private listenToCategories: ICategoriesListener;
	private addCategoryCourier: (data: ICategory) => Promise<ICategory>;
	private editCategory: (data: ICategory) => Promise<ICategory>;
	private removeCategoryCourier: (id: string) => Promise<void>;
	private editCatalogueCourier: (data: IDbFile) => Promise<IDbFile>;
	private config: IFilesConfig;
	private files: IFile[];
	private categories: ICategory[];
	private subscribe: IFileListener;

	constructor(couriers: IFilesService, config: IFilesConfig) {
		this.listenToCatalogues = couriers.listenToCatalogues;
		this.listenToCategories = couriers.listenToCategories;
		this.addCategoryCourier = couriers.addCategory;
		this.editCategory = couriers.editCategory;
		this.removeCategoryCourier = couriers.removeCategory;
		this.editCatalogueCourier = couriers.editCatalogueCourier;
		this.config = config;
	}

	private updateAndNormalise(): IOrganisedData {
		if (!this.files || !this.categories) {
			return;
		}

		return organiseData(this.categories, this.files);
	}

	public listen(callback: IFileListener): CancellableListener {
		this.subscribe = callback;

		const unlistenerCatalogues = this.listenToCatalogues(
			(error, catalogues) => {
				this.files = catalogues;
				const normalisedFilesystem = this.updateAndNormalise();

				if (typeof this.subscribe === 'function') {
					callback(normalisedFilesystem);
				}
			},
			(data) => Object.values(data).map(
				({
					categories_id: categoriesId,
					store_url: storeUrl,
					created_at: createdAt,
					created_by: createdBy,
					dimension,
					...rest
				}) => ({
					...rest,
					categoriesId: categoriesId || [],
					storeUrl,
					createdAt: new Date(createdAt),
					createdBy: createdBy,
					dimension: dimension
				})
			)
		);

		const unlistenerCategories = this.listenToCategories((error, categories) => {
			this.categories = categories;
			const normalisedFilesystem = this.updateAndNormalise();

			if (typeof this.subscribe === 'function') {
				callback(normalisedFilesystem);
			}
		});

		return (): void => {
			this.subscribe = null;
			unlistenerCatalogues();
			unlistenerCategories();
		}
	}

	public async addCategory(data: { parent: string; label: string; depth: number }): Promise<void> {
		await this.addCategoryCourier({ ...data, id: '' });
	}

	public async renameCategory(data: ICategory): Promise<void> {
		await this.editCategory(data);
	}

	public async removeCategory(id: string): Promise<void> {
		await this.removeCategoryCourier(id);
	}

	public async editCatalogue(values: IFileChanges, data: IFile): Promise<void> {
		const { label, categoriesId } = values;
		const { storeUrl, createdAt, createdBy, ...rest } = data;

		await this.editCatalogueCourier({
			...rest,
			label,
			categories_id: categoriesId || [],
			store_url: storeUrl,
			created_at: createdAt.getTime(),
			created_by: createdBy,
		});
	}
}

export const CataloguesService = new CataloguesServiceClass({
	listenToCatalogues,
	listenToCategories,
	addCategory,
	removeCategory,
	editCategory,
	editCatalogueCourier,
}, { apiUrl: process.env.CATALOGUES_URL })