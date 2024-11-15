'use client';

import * as React from 'react';

import { useOptimisticVocabEntriesContext } from '@/components/OptimisticVocabEntriesProvider';

import Entry from '@/components/Entry';
import Toast from '@/components/Toast';
import { useErrorMessageContext } from '@/components/ErrorMessageProvider';
import { AccordionRoot } from '@/components/Accordion';

function SimplerEntryListing({ trim = false }: { trim?: boolean }) {
	let { optimisticState } = useOptimisticVocabEntriesContext();
	let { errorMsg } = useErrorMessageContext();

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
			{errorMsg && <Toast toastType='error' content={errorMsg} />}
		</>
	);
}
export default React.memo(SimplerEntryListing);
