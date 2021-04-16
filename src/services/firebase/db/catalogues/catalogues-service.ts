import { IOrganisedData, organiseData } from "../../../../utils/file-system";
import { CancellableListener } from "../db";
import { IFile, ICategory, IDbFile } from "../types";
import { ICatalogueListener, ICategoriesListener, listenToCatalogues, listenToCategories } from "./catalogues-couriers";

type IFileListener = (fileSystem: IOrganisedData) => void;

interface IFilesService {
	listenToCatalogues: (callback: (hasError: boolean, data?: IFile[]) => void, normaliser: (data: IDbFile[]) => IFile[]) => CancellableListener;
	listenToCategories: (callback: (hasError: boolean, data?: ICategory[]) => void) => CancellableListener;
}

export class CataloguesServiceClass {
	private listenToCatalogues: ICatalogueListener;
	private listenToCategories: ICategoriesListener;
	private files: IFile[];
	private categories: ICategory[];
	private subscribe: IFileListener;

	constructor({ listenToCatalogues, listenToCategories }: IFilesService) {
		this.listenToCatalogues = listenToCatalogues;
		this.listenToCategories = listenToCategories;
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
			(data) => data.map(
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
}

export const CataloguesService = new CataloguesServiceClass({ listenToCatalogues, listenToCategories })