'use client';

import * as React from 'react';
import { useQueryState } from 'nuqs';
import { searchParser } from '@/lib/nuqs';

var SearchVocab = () => {
	var [search, setSearch] = useQueryState('search', searchParser);

	var handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(event.target.value || null);
	};

	return (
		<div>
			<input placeholder='Search vocab' onChange={handleSearch} value={search} />
		</div>
	);
};

export default SearchVocab;
