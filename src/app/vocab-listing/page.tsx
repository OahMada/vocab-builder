import * as React from 'react';

import { getVocabData } from '@/actions';
import { ENTRIES_PER_PAGE } from '@/constants';

import EntryListing from '@/components/EntryListing';
import VocabDataProvider from '@/components/VocabDataProvider';

export default async function VocabListing() {
	let vocabData = await getVocabData(ENTRIES_PER_PAGE);

	if ('errorMessage' in vocabData) {
		return <div>{vocabData.errorMessage}</div>;
	}

	let lastEntryId = vocabData.data.at(-1)?.id;
	return (
		<VocabDataProvider initialState={vocabData.data}>
			<EntryListing initialCursor={lastEntryId} />;
		</VocabDataProvider>
	);
}
