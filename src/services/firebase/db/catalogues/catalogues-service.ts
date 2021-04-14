import { CancellableListener } from "../db";
import { IFile, ICategory, IDbFile } from "../types";
import { ICatalogueListener, ICategoriesListener, listenToCatalogues, listenToCategories } from "./catalogues-couriers";

interface IFilesService {
	listenToCatalogues: (callback: (hasError: boolean, data?: IFile[]) => void, normaliser: (data: IDbFile[]) => IFile[]) => CancellableListener;
	listenToCategories: (callback: (hasError: boolean, data?: ICategory[]) => void) => CancellableListener;
}
type FilesystemListener = (filesystem: { catalogues?: IFile[]; categories?: ICategory[] }) => void;

export class CataloguesServiceClass {
	private listenToCatalogues: ICatalogueListener;
	private listenToCategories: ICategoriesListener;

	constructor({ listenToCatalogues, listenToCategories }: IFilesService) {
		this.listenToCatalogues = listenToCatalogues;
		this.listenToCategories = listenToCategories;
	}

	listenToFilesystem(callback: FilesystemListener): () => void {
		const unlistenerCatalogues = this.listenToCatalogues(
			(error, catalogues) => {
				callback({ catalogues });
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
			callback({ categories });
		});

		return (): void => {
			unlistenerCatalogues();
			unlistenerCategories();
		}
	}
}

export const CataloguesService = new CataloguesServiceClass({ listenToCatalogues, listenToCategories })