'use client';

import * as React from 'react';
import * as Accordion from '@radix-ui/react-accordion';

import { VocabEntry, VocabEntryUpdatingData } from '@/types';

import Entry from '@/components/Entry';
import Toast from '@/components/Toast';

function EntryListing({ vocabData }: { vocabData: VocabEntry[] }) {
	let [optimisticVocabEntries, optimisticallyModifyVocabEntry] = React.useOptimistic(
		vocabData,
		(currentState: VocabEntry[], optimisticValue: string | VocabEntryUpdatingData) => {
			if (typeof optimisticValue === 'string') {
				return currentState.filter((vocab) => vocab.id !== optimisticValue);
			} else {
				return currentState.map((entry) => {
					if (entry.id === optimisticValue.id) {
						return { ...entry, note: optimisticValue.note ?? '', translation: optimisticValue.translation };
					} else {
						return entry;
					}
				});
			}
		}
	);

	let [error, setError] = React.useState('');
	function updateError(errMsg: string) {
		setError(errMsg);
	}

	return (
		<>
			<Accordion.Root type='single' defaultValue='item-1' collapsible>
				{optimisticVocabEntries.slice(0, 5).map((entry, index) => {
					return (
						<Entry
							key={entry.id}
							entry={entry}
							index={index}
							optimisticallyModifyVocabEntry={optimisticallyModifyVocabEntry}
							updateError={updateError}
						/>
					);
				})}
			</Accordion.Root>
			{error && <Toast toastType='error' content={error} />}
		</>
	);
}
export default EntryListing;
