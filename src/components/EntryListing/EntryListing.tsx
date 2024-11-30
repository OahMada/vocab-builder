'use client';

import * as React from 'react';

import { getPaginatedVocabData } from '@/actions';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

import Entry from '@/components/Entry';
import { ENTRIES_PER_PAGE } from '@/constants';
import { useVocabDataProvider } from '@/components/VocabDataProvider';
import { useOptimisticVocabEntriesContext } from '@/components/OptimisticVocabEntriesProvider';
import { useErrorMessageContext } from '@/components/ErrorMessageProvider';
import { AccordionRoot } from '@/components/Accordion';
import ErrorMsg from '@/components/ErrorMsg';

function EntryListing({ initialCursor, initialHaveMoreData, userId }: { initialCursor?: string; initialHaveMoreData: boolean; userId: string }) {
	let [haveMoreData, setHaveMoreData] = React.useState(initialHaveMoreData);
	let cursorRef = React.useRef(initialCursor); // https://www.prisma.io/docs/orm/prisma-client/queries/pagination#cursor-based-pagination
	let [isOnscreen, scrollTrigger] = useIntersectionObserver();
	let vocabDataProvider = useVocabDataProvider();

	if (!vocabDataProvider) {
		throw new Error('EntryListing has to be rendered within VocabDataProvider.');
	}
	let dispatch = vocabDataProvider.dispatch; // vocabDataProvider would change after the dispatch call, so it's better to take dispatch out.

	let { optimisticState } = useOptimisticVocabEntriesContext();
	let { updateError } = useErrorMessageContext();

	let handleQueryPagination = React.useCallback(
		async function () {
			if (!cursorRef.current) {
				// this happens in the case of an empty dataset.
				setHaveMoreData(false);
				return;
			}
			let response = await getPaginatedVocabData(cursorRef.current, userId);

			if ('errorMessage' in response) {
				updateError(response.errorMessage);
				return;
			}
			dispatch({ type: 'add', payload: response.data });

			if (response.data.length === 0 || response.data.length < ENTRIES_PER_PAGE) {
				setHaveMoreData(false);
				return;
			}

			let lastEntry = response.data.at(-1)!; // since the empty array is ruled out
			cursorRef.current = lastEntry.id;
		},
		[dispatch, updateError, userId]
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
				{optimisticState.map((entry, index) => {
					return <Entry key={entry.id} entry={entry} index={index} />;
				})}
				{haveMoreData && (
					<div ref={scrollTrigger}>
						<p>Loading...</p>
					</div>
				)}
			</AccordionRoot>
			<ErrorMsg />
		</>
	);
}
export default EntryListing;
