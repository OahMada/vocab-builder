'use client';

import * as React from 'react';

import { useOptimisticVocabEntriesContext } from '@/components/OptimisticVocabEntriesProvider';

import Entry from '@/components/Entry';
import { AccordionRoot } from '@/components/Accordion';
import ErrorMsg from '@/components/ErrorMsg';

function SimplerEntryListing({ trim = false }: { trim?: boolean }) {
	let { optimisticState } = useOptimisticVocabEntriesContext();

	if (trim) {
		optimisticState = optimisticState.slice(0, 5);
	}

	return (
		<>
			<AccordionRoot type='single' defaultValue='item-1' collapsible>
				{optimisticState.map((entry, index) => {
					return <Entry key={entry.id} entry={entry} index={index} />;
				})}
			</AccordionRoot>
			<ErrorMsg />
		</>
	);
}
export default React.memo(SimplerEntryListing);
