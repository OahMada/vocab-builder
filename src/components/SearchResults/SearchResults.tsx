import * as React from 'react';

import { performVocabSearch } from '@/actions';

import ErrorMessageProvider from '@/components/ErrorMessageProvider';
import OptimisticVocabEntriesProvider from '@/components/OptimisticVocabEntriesProvider';
import SimplerEntryListing from '@/components/SimplerEntryListing';

async function SearchResults({ searchTerm }: { searchTerm: string }) {
	let searchVocabData = await performVocabSearch(searchTerm);

	if ('errorMessage' in searchVocabData) {
		return <div>{searchVocabData.errorMessage}</div>;
	}

	return (
		<ErrorMessageProvider>
			<OptimisticVocabEntriesProvider initialState={searchVocabData.data}>
				<SimplerEntryListing />
			</OptimisticVocabEntriesProvider>
		</ErrorMessageProvider>
	);
}

export default SearchResults;
