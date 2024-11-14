import * as React from 'react';
import type { SearchParams } from 'nuqs/server';

import { getVocabData, performVocabSearch } from '@/actions';
import { ENTRIES_PER_PAGE } from '@/constants';
import { searchParamsCache } from '@/lib/nuqs';

import EntryListing from '@/components/EntryListing';
import VocabDataProvider from '@/components/VocabDataProvider';
import ErrorMessageProvider from '@/components/ErrorMessageProvider';
import SearchVocab from '@/components/SearchVocab';

export default async function VocabListing({ searchParams }: { searchParams: Promise<SearchParams> }) {
	let { search } = searchParamsCache.parse(await searchParams);
	console.log(search);

	let vocabData = await getVocabData(ENTRIES_PER_PAGE);

	if (search) {
		let searchVocabData = await performVocabSearch(search);
		console.log(searchVocabData);
	}

	if ('errorMessage' in vocabData) {
		return <div>{vocabData.errorMessage}</div>;
	}

	let initialHaveMoreData = vocabData.data.length === ENTRIES_PER_PAGE; // if lesser, there is no more data.
	let lastEntryId = vocabData.data.at(-1)?.id;

	return (
		<div>
			<SearchVocab />
			<React.Suspense fallback={<p>Loading...</p>}>
				<ErrorMessageProvider>
					<VocabDataProvider initialState={vocabData.data}>
						<EntryListing initialCursor={lastEntryId} initialHaveMoreData={initialHaveMoreData} />
					</VocabDataProvider>
				</ErrorMessageProvider>
			</React.Suspense>
		</div>
	);
}
