'use client';

import * as React from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { produce } from 'immer';

import { VocabEntryUpdatingData } from '@/lib/dataValidation';
import { VocabEntry, PageOptions } from '@/types';
import { getPaginatedVocabData } from '@/actions';

import Entry from '@/components/Entry';
import Toast from '@/components/Toast';

function EntryListing({ vocabData, page = 'root', initialCursor }: { vocabData: VocabEntry[]; page?: PageOptions; initialCursor?: string }) {
	let [haveMoreData, setHaveMoreData] = React.useState(true);
	let [cursor, setCursor] = React.useState(initialCursor);

	let [vocabEntries, setVocabEntries] = React.useState(vocabData);
	let [optimisticVocabEntries, optimisticallyModifyVocabEntry] = React.useOptimistic(
		vocabEntries,
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

	async function handleQueryPagination() {
		if (!cursor) {
			throw new Error('There is no cursor supplied for database query pagination.');
		}
		let response = await getPaginatedVocabData(cursor);

		if ('errorMessage' in response) {
			updateError(response.errorMessage);
			return;
		}

		if (response.data.length === 0) {
			setHaveMoreData(false);
			return;
		}

		let nextVocabEntries = produce(vocabEntries, (draft) => {
			return draft.concat(response.data);
		});
		setVocabEntries(nextVocabEntries);
		let lastEntry = response.data.at(-1)!; // since the empty array is ruled out
		setCursor(lastEntry.id);
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
				{page === 'vocab-listing' && (
					<div>
						<button onClick={handleQueryPagination}>Get More</button>
					</div>
				)}
			</Accordion.Root>
			{error && <Toast toastType='error' content={error} />}
		</>
	);
}
export default EntryListing;
