import * as React from 'react';

import { getVocabData } from '@/actions';
import { ENTRIES_PER_PAGE } from '@/constants';

import EntryListing from '@/components/EntryListing';

export default async function VocabListing() {
	let vocabData = await getVocabData(ENTRIES_PER_PAGE);

	if ('errorMessage' in vocabData) {
		return <div>{vocabData.errorMessage}</div>;
	}

	let lastEntryId = vocabData.data.at(-1)?.id;
	return <EntryListing vocabData={vocabData.data} page={'vocab-listing'} initialCursor={lastEntryId} />;
}
