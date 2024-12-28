'use client';

import * as React from 'react';

import { useOptimisticVocabEntriesContext } from '@/components/OptimisticVocabEntriesProvider';

import Entry from '@/components/Entry';
import { AccordionRoot } from '@/components/Accordion';
import ErrorMsg from '@/components/ErrorMsg';
import HeaderTag from '@/components/HeaderTag';

function SimplerEntryListing({ trim = false }: { trim?: boolean }) {
	let { optimisticState } = useOptimisticVocabEntriesContext();

	if (trim) {
		optimisticState = optimisticState.slice(0, 3);
	}

	if (optimisticState.length === 0) {
		return (
			<div>
				<HeaderTag level={3}>No sentence saved yet.</HeaderTag>
			</div>
		);
	}

	return (
		<>
			<AccordionRoot type='single' defaultValue='item-1' collapsible>
				{optimisticState.length === 0 && <p>Empty List</p>}
				{optimisticState.map((entry, index) => {
					return <Entry key={entry.id} entry={entry} index={index} />;
				})}
			</AccordionRoot>
			<ErrorMsg />
		</>
	);
}
export default React.memo(SimplerEntryListing);

export function SimplerEntryListingFallBack() {
	return (
		<div>
			<p>Loading...</p>
		</div>
	);
}
