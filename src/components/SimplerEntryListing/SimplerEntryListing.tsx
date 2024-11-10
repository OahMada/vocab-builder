'use client';

import * as React from 'react';
import * as Accordion from '@radix-ui/react-accordion';

import { useOptimisticVocabEntriesContext } from '../OptimisticVocabEntriesProvider';

import Entry from '@/components/Entry';
import Toast from '@/components/Toast';

function EntryListing() {
	let { optimisticState } = useOptimisticVocabEntriesContext();

	let [error, setError] = React.useState('');
	function updateError(errMsg: string) {
		setError(errMsg);
	}

	return (
		<>
			<Accordion.Root type='single' defaultValue='item-1' collapsible>
				{optimisticState.slice(0, 5).map((entry, index) => {
					return <Entry key={entry.id} entry={entry} index={index} updateError={updateError} />;
				})}
			</Accordion.Root>
			{error && <Toast toastType='error' content={error} />}
		</>
	);
}
export default EntryListing;
