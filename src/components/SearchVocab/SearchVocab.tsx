'use client';

import * as React from 'react';
import { useQueryState } from 'nuqs';
import { useDebouncedCallback } from 'use-debounce';
import styled from 'styled-components';

import { searchParser } from '@/lib/nuqs';
import useKeyboard from '@/hooks/useKeyboard';
import Button from '@/components/Button';

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
		<StyledDiv>
			<input placeholder='Search vocab' onChange={handleSearch} defaultValue={search} ref={inputRef} />
			<Button
				onClick={() => {
					setSearch(null);
					if (!inputRef.current) {
						throw new Error('inputRef.current is null');
					}
					inputRef.current.value = ''; // because the input is uncontrolled
				}}
			>
				Clear
			</Button>
		</StyledDiv>
	);
};

export default SearchVocab;

var StyledDiv = styled.div`
	display: flex;
	gap: var(--gap-normal);

	input {
		flex-basis: 20rem;
	}
`;
