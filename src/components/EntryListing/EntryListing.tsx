'use client';

import * as React from 'react';
import * as Accordion from '@radix-ui/react-accordion';

import { VocabEntry, VocabEntryUpdatingData } from '@/types';
import { getPaginatedVocabData } from '@/actions';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

import Entry from '@/components/Entry';
import Toast from '@/components/Toast';
import { ENTRIES_PER_PAGE } from '@/constants';
import { useVocabDataProvider } from '@/components/VocabDataProvider';

function EntryListing({ initialCursor }: { initialCursor?: string }) {
	let [haveMoreData, setHaveMoreData] = React.useState(true);
	let [cursor, setCursor] = React.useState(initialCursor); // https://www.prisma.io/docs/orm/prisma-client/queries/pagination#cursor-based-pagination
	let provider = useVocabDataProvider();

	if (!provider) {
		throw new Error('EntryListing has to be rendered within VocabDataProvider.');
	}

	let [isOnscreen, scrollTrigger] = useIntersectionObserver();
	let [optimisticVocabEntries, optimisticallyModifyVocabEntry] = React.useOptimistic(
		provider.state,
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
			// this happens in the case of an empty dataset.
			setHaveMoreData(false);
			return;
		}
		let response = await getPaginatedVocabData(cursor);

		if ('errorMessage' in response) {
			updateError(response.errorMessage);
			return;
		}
		provider?.dispatch({ type: 'add', payload: response.data });

		if (response.data.length === 0 || response.data.length < ENTRIES_PER_PAGE) {
			setHaveMoreData(false);
			return;
		}

		let lastEntry = response.data.at(-1)!; // since the empty array is ruled out
		setCursor(lastEntry.id);
	}

	React.useEffect(() => {
		async function fetchMoreData() {
			await handleQueryPagination();
		}
		if (isOnscreen && haveMoreData) fetchMoreData();
	}, [isOnscreen, haveMoreData]);

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
				{haveMoreData && (
					<div ref={scrollTrigger}>
						<p>Loading...</p>
					</div>
				)}
			</Accordion.Root>
			{error && <Toast toastType='error' content={error} />}
		</>
	);
}
export default EntryListing;
