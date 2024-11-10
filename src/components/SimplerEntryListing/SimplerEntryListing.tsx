'use client';

import * as React from 'react';
import * as Accordion from '@radix-ui/react-accordion';

import { useOptimisticVocabEntriesContext } from '../OptimisticVocabEntriesProvider';

import Entry from '@/components/Entry';
import Toast from '@/components/Toast';
import { useErrorMessageContext } from '../ErrorMessageProvider';

function EntryListing() {
	let { optimisticState } = useOptimisticVocabEntriesContext();
	let { errorMsg } = useErrorMessageContext();

	return (
		<>
			<Accordion.Root type='single' defaultValue='item-1' collapsible>
				{optimisticState.slice(0, 5).map((entry, index) => {
					return <Entry key={entry.id} entry={entry} index={index} />;
				})}
			</Accordion.Root>
			{errorMsg && <Toast toastType='error' content={errorMsg} />}
		</>
	);
}
export default EntryListing;
