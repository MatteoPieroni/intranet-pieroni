import { useEffect, useState } from "react"
import { getToken } from "../../services/firebase/auth";
import { getFileDownloadUrl } from "../../services/firebase/storage";
import { useConfig } from "./useConfig";

type IInternalFile = {
	fileUrl: string;
	httpHeaders: {
		'x-access-token': string;
	};
}

type IFirebaseFile = {
	fileUrl: string;
}

export const useStorageFile: (url: string) => IInternalFile | IFirebaseFile | null = (url) => {
	const { isInternal } = useConfig();
	const [token, setToken] = useState('');
	const [downloadUrl, setDownloadUrl] = useState('');

	useEffect(() => {
		(async (): Promise<void> => {
			if (isInternal) {
				const refreshedToken = await getToken();

				setToken(refreshedToken);
				return;
			}

			try {
				const parsedUrl = await getFileDownloadUrl(url);

				setDownloadUrl(parsedUrl);
			} catch (e) {
				console.error(e);
			}
		})();
	}, [url]);

	if ((isInternal && !token) || (!isInternal && !downloadUrl)) {
		return null;
	}

	if (isInternal) {
		return {
			fileUrl: url,
			httpHeaders: {
				'x-access-token': token,
			},
		};
	}

	return {
		fileUrl: downloadUrl,
	};
}