import { getToken } from "../firebase/auth";
import { IFile } from "../firebase/db";
import { apiExists, deleteCatalogue, syncCatalogues, syncCataloguesStatus, uploadCatalogue } from "./catalogues-couriers";

type ICall<T, P = void> = (url: string, token: string, ...args: T[]) => Promise<P>;

type ICouriers = {
	getToken: () => Promise<string>;
	checkExistance: ICall<undefined, boolean>;
	upload: ICall<IFile>;
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
	private upload: ICall<IFile>;
	private delete: ICall<string>;
	private syncCourier: ICall<never, string>;
	private getSyncStatusCourier: ICall<never, ISyncStatuses>;

	constructor(couriers: ICouriers) {
		this.getToken = couriers.getToken;
		this.checkExistance = couriers.checkExistance;
		this.syncCourier = couriers.sync;
		this.getSyncStatusCourier = couriers.syncStatus;
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

	public async sync(callback: (status: 'succeeded' | 'errored') => void): Promise<void> {
		await this.refreshToken();

		const token = await this.syncCourier(`${this.url}/files/sync`, this.token);

		this.syncCallId = token;

		this.pollSyncStatus(callback);
	}

	public async pollSyncStatus(callback: (status: 'succeeded' | 'errored') => void): Promise<void> {
		await this.refreshToken();

		const status = await this.getSyncStatusCourier(`${this.url}/files/queue/${this.syncCallId}`, this.token);

		if (status === 'in-progress') {
			setTimeout(() => {
				this.pollSyncStatus(callback);
			}, 500);

			return;
		}

		callback(status);
	}
}

export const CataloguesApiService = new CataloguesApiServiceClass({
	getToken: getToken,
	checkExistance: apiExists,
	upload: uploadCatalogue,
	delete: deleteCatalogue,
	sync: syncCatalogues,
	syncStatus: syncCataloguesStatus
});
