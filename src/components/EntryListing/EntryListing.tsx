'use client';

import * as React from 'react';
import * as Accordion from '@radix-ui/react-accordion';

import { VocabEntry } from '@/types';

import Entry from '@/components/Entry';

function EntryListing({ vocab }: { vocab: VocabEntry[] }) {
	return (
		<Accordion.Root type='single' defaultValue='item-1' collapsible>
			{vocab.map((entry, index) => {
				return <Entry key={entry.id} entry={entry} index={index} />;
			})}
		</Accordion.Root>
	);
}
export default EntryListing;
