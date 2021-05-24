import { getToken } from "../firebase/auth";
import { IFile } from "../firebase/db";
import { apiExists, deleteCatalogue, uploadCatalogue } from "./catalogues-couriers";

type ICall<T, P = void> = (url: string, token: string, ...args: T[]) => Promise<P>;

type ICouriers = {
	getToken: () => Promise<string>;
	checkExistance: ICall<undefined, boolean>;
	upload: ICall<IFile>;
	delete: ICall<string>;
}

class CataloguesApiServiceClass {
	private url: string;
	private token: string;
	private getToken: () => Promise<string>;
	private checkExistance: ICall<undefined, boolean>;
	private upload: ICall<IFile>;
	private delete: ICall<string>;

	constructor(couriers: ICouriers) {
		this.getToken = couriers.getToken;
		this.checkExistance = couriers.checkExistance;
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
}

export const CataloguesApiService = new CataloguesApiServiceClass({
	getToken: getToken,
	checkExistance: apiExists,
	upload: uploadCatalogue,
	delete: deleteCatalogue,
});
