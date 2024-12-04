import * as React from 'react';

import { performVocabSearch } from '@/actions';
import { auth } from '@/auth';

import ErrorMessageProvider from '@/components/ErrorMessageProvider';
import OptimisticVocabEntriesProvider from '@/components/OptimisticVocabEntriesProvider';
import SimplerEntryListing from '@/components/SimplerEntryListing';

async function SearchResults({ searchTerm }: { searchTerm: string }) {
	let session = await auth();
	if (!session?.user) {
		throw new Error('Not authenticated.');
	}

	let searchVocabData = await performVocabSearch(searchTerm, session.user.id);
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
