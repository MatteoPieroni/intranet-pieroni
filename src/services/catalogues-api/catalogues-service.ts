import { getToken } from "../firebase/auth";
import { INewFile } from "../firebase/db";
import { apiExists, deleteCatalogue, syncCatalogues, syncCataloguesStatus, uploadCatalogues } from "./catalogues-couriers";

type ICall<T, P = void> = (url: string, token: string, ...args: T[]) => Promise<P>;

type ICouriers = {
	getToken: () => Promise<string>;
	checkExistance: ICall<undefined, boolean>;
	upload: ICall<FormData, string>;
	delete: ICall<string>;
	sync: ICall<never, string>;
	syncStatus: ICall<never, ISyncStatuses>;
}

export type ISyncStatuses = 'in-progress' | 'errored' | 'succeeded';

class CataloguesApiServiceClass {
	private url: string;
	private token: string;
	private syncCallId: string;
	private getToken: () => Promise<string>;
	private checkExistance: ICall<undefined, boolean>;
	private upload: ICall<FormData, string>;
	private delete: ICall<string>;
	private syncCourier: ICall<never, string>;
	private getSyncStatusCourier: ICall<never, ISyncStatuses>;

	constructor(couriers: ICouriers) {
		this.getToken = couriers.getToken;
		this.checkExistance = couriers.checkExistance;
		this.syncCourier = couriers.sync;
		this.getSyncStatusCourier = couriers.syncStatus;
		this.upload = couriers.upload;
		this.delete = couriers.delete;
	}

	set apiUrl(url: string) {
		this.url = url
	}

	private async refreshToken(): Promise<void> {
		this.token = await this.getToken();
	}

	public async exists(): Promise<boolean> {
		await this.refreshToken();

		const apiExists = await this.checkExistance(`${this.url}/exists`, this.token);

		return apiExists;
	}

	public async sync(): Promise<string> {
		await this.refreshToken();

		const token = await this.syncCourier(`${this.url}/files/sync`, this.token);

		return token;
	}

	public async pollSyncStatus(id: string, callback: (status: 'succeeded' | 'errored') => void): Promise<void> {
		await this.refreshToken();

		let status: 'succeeded' | 'errored' | 'in-progress';
		try {
			status = await this.getSyncStatusCourier(`${this.url}/files/queue/${id}`, this.token);
		} catch (e) {
			status = 'errored';
		}

		if (status === 'in-progress') {
			setTimeout(() => {
				this.pollSyncStatus(id, callback);
			}, 500);

			return;
		}

		callback(status);
	}

	public async uploadCatalogues(values: INewFile): Promise<void> {
		if (values.files.length === 0) {
			throw new Error('Nessun file selezionato');
		}

		const formData = new FormData();

		values.files.forEach(file => formData.append('pdf_catalogues', file));
		values.categoriesId.forEach(category => formData.append('categories', category));
		formData.append('label', values.label);

		await this.refreshToken();
		await this.upload(`${this.url}/files/create`, this.token, formData)
	}

	public async deleteCatalogue(id: string): Promise<void> {
		await this.refreshToken();

		await this.delete(`${this.url}/files/delete`, this.token, id);
	}
}

export const CataloguesApiService = new CataloguesApiServiceClass({
	getToken: getToken,
	checkExistance: apiExists,
	upload: uploadCatalogues,
	delete: deleteCatalogue,
	sync: syncCatalogues,
	syncStatus: syncCataloguesStatus
});
