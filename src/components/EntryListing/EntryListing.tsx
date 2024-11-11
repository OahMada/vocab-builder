'use client';

import * as React from 'react';

import { getPaginatedVocabData } from '@/actions';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

import Entry from '@/components/Entry';
import Toast from '@/components/Toast';
import { ENTRIES_PER_PAGE } from '@/constants';
import { useVocabDataProvider } from '@/components/VocabDataProvider';
import { useOptimisticVocabEntriesContext } from '@/components/OptimisticVocabEntriesProvider';
import { useErrorMessageContext } from '@/components/ErrorMessageProvider';
import { AccordionRoot } from '@/components/Accordion';

function EntryListing({ initialCursor, initialHaveMoreData }: { initialCursor?: string; initialHaveMoreData: boolean }) {
	let [haveMoreData, setHaveMoreData] = React.useState(initialHaveMoreData);
	let [cursor, setCursor] = React.useState(initialCursor); // https://www.prisma.io/docs/orm/prisma-client/queries/pagination#cursor-based-pagination
	let [isOnscreen, scrollTrigger] = useIntersectionObserver();

	let provider = useVocabDataProvider();

	if (!provider) {
		throw new Error('EntryListing has to be rendered within VocabDataProvider.');
	}
	let { optimisticState } = useOptimisticVocabEntriesContext();

	let { errorMsg, updateError } = useErrorMessageContext();

	let handleQueryPagination = React.useCallback(
		async function () {
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
		},
		[cursor, provider, updateError]
	);

	React.useEffect(() => {
		async function fetchMoreData() {
			await handleQueryPagination();
		}
		if (isOnscreen && haveMoreData) fetchMoreData();
	}, [haveMoreData, isOnscreen, handleQueryPagination]);

	return (
		<>
			<AccordionRoot type='single' defaultValue='item-1' collapsible>
				{optimisticState.slice(0, 5).map((entry, index) => {
					return <Entry key={entry.id} entry={entry} index={index} />;
				})}
				{haveMoreData && (
					<div ref={scrollTrigger}>
						<p>Loading...</p>
					</div>
				)}
			</AccordionRoot>
			{errorMsg && <Toast toastType='error' content={errorMsg} />}
		</>
	);
}
export default EntryListing;
