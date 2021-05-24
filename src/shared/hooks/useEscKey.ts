import { useEffect } from "react";

export const useEscKey = (fn: () => void, condition?: boolean): void => {
	useEffect(() => {
		const listener = (e: KeyboardEvent): void => {
			if (e.key === 'Escape' && condition) {
				fn();
			}
		};

		document.addEventListener('keyup', listener);

		return (): void => {
			document.removeEventListener('keyup', listener);
		}
	}, [fn, condition])
};