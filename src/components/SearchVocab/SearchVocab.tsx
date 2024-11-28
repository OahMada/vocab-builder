'use client';

import * as React from 'react';
import { useQueryState } from 'nuqs';
import { useDebouncedCallback } from 'use-debounce';

import { searchParser } from '@/lib/nuqs';
import useKeyboard from '@/hooks/useKeyboard';

var SearchVocab = () => {
	let isKeyPressed = useKeyboard('Enter');

	var [search, setSearch] = useQueryState('search', searchParser);
	let inputRef = React.useRef<HTMLInputElement | null>(null);

	let handleSearch = useDebouncedCallback((event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value), 1000);

	React.useEffect(() => {
		if (isKeyPressed) {
			handleSearch.flush();
		}
	}, [handleSearch, isKeyPressed]);

	return (
		<>
			<input placeholder='Search vocab' onChange={handleSearch} defaultValue={search} ref={inputRef} />
			<button
				onClick={() => {
					setSearch(null);
					if (!inputRef.current) {
						throw new Error('inputRef.current is null');
					}
					inputRef.current.value = ''; // because the input is uncontrolled
				}}
			>
				Clear
			</button>
		</>
	);
};

export default SearchVocab;
