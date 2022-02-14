import { ISyncStatuses } from "./catalogues-service";

export const apiExists: (url: string, token: string) => Promise<boolean> = async (apiUrl, token) => new Promise(async (resolve, reject) => {
	// this request will hang if we are outside the network, so we need to time it out
	const controller = new AbortController();

	setTimeout(() => controller.abort(), 5 * 1000);

	try {
		const response = await fetch(apiUrl, {
			method: 'GET',
			headers: {
				'x-access-token': token,
			},
			signal: controller.signal
		});

		if (!response.ok) {
			throw new Error(`${response.status}`);
		}

		resolve(true);
	} catch (e) {
		resolve(false);
	}
});

export const uploadCatalogues: (url: string, token: string, values: FormData) => Promise<string[]> = (apiUrl, token, values) => {
	return new Promise(async (resolve, reject) => {
		try {
			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: {
					'x-access-token': token,
				},
				body: values,
			});

			if (!response.ok) {
				throw new Error(`${response.status}`);
			}

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

			if (!response.ok) {
				throw new Error(`${response.status}`);
			}

			await response.text();

			resolve();
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
			if (!response.ok) {
				throw new Error(`${response.status}`);
			}

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
			if (!response.ok) {
				throw new Error(`${response.status}`);
			}

			const res = await response.text() as ISyncStatuses;

			resolve(res);
		} catch (e) {
			reject(e);
		}
	})
}