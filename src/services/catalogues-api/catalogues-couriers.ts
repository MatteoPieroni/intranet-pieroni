import { IFile } from "../firebase/db";
import { ISyncStatuses } from "./catalogues-service";

export const apiExists: (url: string, token: string) => Promise<boolean> = async (apiUrl, token) => new Promise(async (resolve, reject) => {
	try {
		await fetch(apiUrl, {
			method: 'GET',
			headers: {
				'x-access-token': token,
			},
		});

		resolve(true);
	} catch (e) {
		resolve(false);
	}
});

export const uploadCatalogue: (url: string, token: string, values: IFile) => Promise<void> = (apiUrl, token, values) => {
	return new Promise(async (resolve, reject) => {
		try {
			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-access-token': token,
				},
				body: JSON.stringify(values),
			});
			const res = await response.json();

			resolve(res);
		} catch (e) {
			reject(e);
		}
	})
}

export const deleteCatalogue: (url: string, token: string, values: string) => Promise<void> = (apiUrl, token, values) => {
	return new Promise(async (resolve, reject) => {
		try {
			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-access-token': token,
				},
				body: JSON.stringify({ id: values }),
			});
			const res = await response.json();

			resolve(res);
		} catch (e) {
			reject(e);
		}
	})
}

export const syncCatalogues: (url: string, token: string) => Promise<string> = (apiUrl, token) => {
	return new Promise(async (resolve, reject) => {
		try {
			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-access-token': token,
				},
			});
			const res = await response.text();

			resolve(res);
		} catch (e) {
			reject(e);
		}
	})
}

export const syncCataloguesStatus: (url: string, token: string) => Promise<ISyncStatuses> = (apiUrl, token) => {
	return new Promise(async (resolve, reject) => {
		try {
			const response = await fetch(apiUrl, { headers: { 'x-access-token': token } });
			const res = await response.text() as ISyncStatuses;

			resolve(res);
		} catch (e) {
			reject(e);
		}
	})
}