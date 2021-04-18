import { IOrganisedData, organiseData } from "../../../../utils/file-system";
import { CancellableListener } from "../db";
import { IFile, ICategory, IDbFile } from "../types";
import { ICatalogueListener, ICategoriesListener, listenToCatalogues, listenToCategories, addCategory, removeCategory, editCategory } from "./catalogues-couriers";

type IFileListener = (fileSystem: IOrganisedData) => void;

interface IFilesService {
	listenToCatalogues: (callback: (hasError: boolean, data?: IFile[]) => void, normaliser: (data: { [key: string]: IDbFile }) => IFile[]) => CancellableListener;
	listenToCategories: (callback: (hasError: boolean, data?: ICategory[]) => void) => CancellableListener;
	addCategory: (data: ICategory) => Promise<ICategory>;
	editCategory: (data: ICategory) => Promise<ICategory>;
	removeCategory: (id: string) => Promise<void>;
}

export class CataloguesServiceClass {
	private listenToCatalogues: ICatalogueListener;
	private listenToCategories: ICategoriesListener;
	private addCategoryCourier: (data: ICategory) => Promise<ICategory>;
	private editCategory: (data: ICategory) => Promise<ICategory>;
	private removeCategoryCourier: (id: string) => Promise<void>;
	private files: IFile[];
	private categories: ICategory[];
	private subscribe: IFileListener;

	constructor({ listenToCatalogues, listenToCategories, addCategory, removeCategory, editCategory }: IFilesService) {
		this.listenToCatalogues = listenToCatalogues;
		this.listenToCategories = listenToCategories;
		this.addCategoryCourier = addCategory;
		this.editCategory = editCategory;
		this.removeCategoryCourier = removeCategory;
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
}

export const CataloguesService = new CataloguesServiceClass({ listenToCatalogues, listenToCategories, addCategory, removeCategory, editCategory })