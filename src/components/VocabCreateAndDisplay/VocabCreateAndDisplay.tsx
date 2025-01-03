'use client';

import * as React from 'react';
import Cookie from 'js-cookie';

import { VocabEntry } from '@/types';

import { SENTENCE_TEXT } from '@/constants';

import SimplerEntryListing, { SimplerEntryListingFallback } from '@/components/SimplerEntryListing';
import SubmitNewCollectionEntry from '@/components/SubmitNewCollectionEntry';
import UserInput from '@/components/UserInput';
import ErrorBoundaryWrapper from '@/components/ErrorBoundaryWrapper';
import SWRConfigWrapper from '@/components/SWRConfigWrapper';
import OptimisticVocabEntriesProvider from '@/components/OptimisticVocabEntriesProvider';
import ErrorMessageProvider from '@/components/ErrorMessageProvider';
import CustomLink from '@/components/CustomLink';

function VocabCreateAndDisplay({ vocabData, savedSentence }: { vocabData: VocabEntry[]; savedSentence: string | undefined }) {
	let [optimisticVocab, addOptimisticVocabEntry] = React.useOptimistic(vocabData, (currentState: VocabEntry[], newEntry: VocabEntry) => {
		if (currentState.length < 5) {
			return [newEntry, ...currentState];
		} else {
			return [newEntry, ...currentState.slice(0, -1)]; // Make sure there are always 5 entries that are returned.
		}
	});

	let [sentence, setSentence] = React.useState<string | undefined>(savedSentence);
	let [shouldClearUserInput, setShouldClearUserInput] = React.useState(false);

	let updateSentence = React.useCallback(function (text: string) {
		setSentence(text);
		Cookie.set(SENTENCE_TEXT, text, {
			expires: 1000,
		});
	}, []);

	let updateShouldClearUserInput = React.useCallback(function (value: boolean) {
		setShouldClearUserInput(value);
	}, []);

	return (
		<>
			<ErrorBoundaryWrapper>
				{!sentence ? (
					<ErrorMessageProvider>
						<UserInput updateSentence={updateSentence} clearUserInput={shouldClearUserInput} />
					</ErrorMessageProvider>
				) : (
					<SWRConfigWrapper>
						<ErrorMessageProvider>
							<SubmitNewCollectionEntry
								sentence={sentence}
								addOptimisticVocabEntry={addOptimisticVocabEntry}
								updateSentence={updateSentence}
								updateShouldClearUserInput={updateShouldClearUserInput}
							/>
						</ErrorMessageProvider>
					</SWRConfigWrapper>
				)}
			</ErrorBoundaryWrapper>
			<div>
				<CustomLink href='/vocab-listing' prefetch={true}>
					View All
				</CustomLink>
			</div>
			<React.Suspense fallback={<SimplerEntryListingFallback />}>
				<ErrorMessageProvider>
					<OptimisticVocabEntriesProvider initialState={optimisticVocab}>
						<SimplerEntryListing trim={true} />
					</OptimisticVocabEntriesProvider>
				</ErrorMessageProvider>
			</React.Suspense>
		</>
	);
}

export default VocabCreateAndDisplay;
