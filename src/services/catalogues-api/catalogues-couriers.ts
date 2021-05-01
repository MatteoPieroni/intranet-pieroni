import { IFile } from "../firebase/db";

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