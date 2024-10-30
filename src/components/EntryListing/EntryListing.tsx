'use client';

import * as React from 'react';
import * as Accordion from '@radix-ui/react-accordion';

import { VocabEntry } from '@/types';

import Entry from '@/components/Entry';

function EntryListing({ vocab }: { vocab: VocabEntry[] }) {
	let [optimisticVocab, optimisticallyDeleteVocabEntry] = React.useOptimistic(vocab, (currentState: VocabEntry[], VocabEntryId: string) => {
		return currentState.filter((vocab) => vocab.id !== VocabEntryId);
	});

	return (
		<Accordion.Root type='single' defaultValue='item-1' collapsible>
			{optimisticVocab.map((entry, index) => {
				return <Entry key={entry.id} entry={entry} index={index} optimisticallyDeleteVocabEntry={optimisticallyDeleteVocabEntry} />;
			})}
		</Accordion.Root>
	);
}
export default EntryListing;
