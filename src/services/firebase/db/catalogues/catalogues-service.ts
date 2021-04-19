import { IOrganisedData, organiseData } from "../../../../utils/file-system";
import { CancellableListener } from "../db";
import { IFile, ICategory, IDbFile, IFileApi } from "../types";
import {
	ICatalogueListener,
	ICategoriesListener,
	listenToCatalogues,
	listenToCategories,
	addCategory,
	removeCategory,
	editCategory,
	changeCatalogueCategory,
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
	changeCatalogueCategory: (url: string, values: IFileApi) => Promise<void>;
}

export class CataloguesServiceClass {
	private listenToCatalogues: ICatalogueListener;
	private listenToCategories: ICategoriesListener;
	private addCategoryCourier: (data: ICategory) => Promise<ICategory>;
	private editCategory: (data: ICategory) => Promise<ICategory>;
	private removeCategoryCourier: (id: string) => Promise<void>;
	private changeCatalogueCategory: (url: string, values: IFileApi) => Promise<void>;
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
		this.changeCatalogueCategory = couriers.changeCatalogueCategory;
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
					...rest
				}) => ({
					...rest,
					categoriesId,
					storeUrl
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

	public async changeFileCategory(id: string, categories: string): Promise<void> {
		await this.changeCatalogueCategory(this.config.apiUrl, { id, categories });
	}
}

export const CataloguesService = new CataloguesServiceClass({
	listenToCatalogues,
	listenToCategories,
	addCategory,
	removeCategory,
	editCategory,
	changeCatalogueCategory,
}, { apiUrl: process.env.CATALOGUES_URL })