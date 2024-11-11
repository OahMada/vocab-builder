'use client';

import * as React from 'react';

import { useOptimisticVocabEntriesContext } from '@/components/OptimisticVocabEntriesProvider';

import Entry from '@/components/Entry';
import Toast from '@/components/Toast';
import { useErrorMessageContext } from '@/components/ErrorMessageProvider';
import { AccordionRoot } from '@/components/Accordion';

function SimplerEntryListing() {
	let { optimisticState } = useOptimisticVocabEntriesContext();
	let { errorMsg } = useErrorMessageContext();

	return (
		<>
			<AccordionRoot type='single' defaultValue='item-1' collapsible>
				{optimisticState.slice(0, 5).map((entry, index) => {
					return <Entry key={entry.id} entry={entry} index={index} />;
				})}
			</AccordionRoot>
			{errorMsg && <Toast toastType='error' content={errorMsg} />}
		</>
	);
}
export default React.memo(SimplerEntryListing);
