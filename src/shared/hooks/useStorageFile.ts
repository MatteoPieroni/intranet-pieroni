import { useEffect, useState } from "react"
import { getFileDownloadUrl } from "../../services/firebase/storage";

export const useStorageFile: (url: string) => string = (url) => {
	const [downloadUrl, setDownloadUrl] = useState('');

	useEffect(() => {
		(async (): Promise<void> => {
			const parsedUrl = await getFileDownloadUrl(url);

			setDownloadUrl(parsedUrl);
		})();
	}, [url]);

	return downloadUrl;
}