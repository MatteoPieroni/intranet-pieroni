import { IFile, IFolder, ListenToDbCollection } from "../types";
import { listenToCatalogues, listenToFolders } from "./catalogues-couriers";

interface IFilesService {
	listenToCatalogues: ListenToDbCollection;
	listenToFolders: ListenToDbCollection;
}
type FilesystemListener = (filesystem: { catalogues?: IFile[]; folders?: IFolder[] }) => void;

export class CataloguesServiceClass {
	private listenToCatalogues: ListenToDbCollection;
	private listenToFolders: ListenToDbCollection

	constructor({ listenToCatalogues, listenToFolders }: IFilesService) {
		this.listenToCatalogues = listenToCatalogues;
		this.listenToFolders = listenToFolders;
	}

	listenToFilesystem(callback: FilesystemListener): () => void {
		const unlistenerCatalogues = this.listenToCatalogues((error, catalogues) => {
			callback({ catalogues });
		});

		const unlistenerFolders = this.listenToFolders((error, folders) => {
			callback({ folders });
		});

		return (): void => {
			unlistenerCatalogues();
			unlistenerFolders();
		}
	}
}

export const CataloguesService = new CataloguesServiceClass({listenToCatalogues, listenToFolders}) 
