import { ChangeEvent, useRef, useState } from 'react';
import Fuse from 'fuse.js';
import { useEscKey } from './useEscKey';

export interface ISearch<T> {
	isSearching: boolean;
	onSearch: (event: ChangeEvent<HTMLInputElement>) => void;
	results: T[];
}

export const useSearch = <T>(data: T[], config: Fuse.IFuseOptions<T>): ISearch<T> => {
	const searchService = useRef(new Fuse(data, config));
	const [results, setResults] = useState<T[]>();
	const [searchString, setSearchString] = useState('');
	const [isSearching, setIsSearching] = useState(false);

	const reset = (): void => {
		setIsSearching(false);
		setSearchString('');
		setResults([]);
	}

	useEscKey(reset, isSearching);

	const onSearch = (e: ChangeEvent<HTMLInputElement>): void => {
		const value = e.target.value;

		if (!searchString && value) {
			setIsSearching(true);
		}

		setSearchString(value);

		const searchResultsWithScores = searchService.current.search(value);
		const searchResults = searchResultsWithScores.map(result => result.item);

		setResults(searchResults);
	}

	return {
		isSearching,
		onSearch,
		results
	}
}