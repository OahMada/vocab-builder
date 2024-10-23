'use client';

import * as React from 'react';
import Cookie from 'js-cookie';

import EntryListing from '@/components/EntryListing';
import SubmitNewCollectionEntry from '@/components/SubmitNewCollectionEntry';
import { VocabEntry } from '@/components/Vocab/getVocabList';
import { SENTENCE_TO_BE_PROCESSED } from '@/constants';
import UserInput from '@/components/UserInput';
import ErrorBoundaryWrapper from '../ErrorBoundaryWrapper';

function VocabCreateAndDisplay({ vocabList, savedSentence }: { vocabList: VocabEntry[]; savedSentence: string | undefined }) {
	let [optimisticVocab, addOptimisticVocabEntry] = React.useOptimistic(vocabList, (currentState: VocabEntry[], newEntry: VocabEntry) => {
		return [newEntry, ...currentState.slice(0, -1)]; // Make sure there are always 5 entries that are returned.
	});

	let [sentence, setSentence] = React.useState<string | undefined>(savedSentence);
	let [shouldClearUserInput, setShouldClearUserInput] = React.useState(false);

	function updateSentence(text: string) {
		setSentence(text);
		Cookie.set(SENTENCE_TO_BE_PROCESSED, text, {
			expires: 1000,
		});
	}

	function updateShouldClearUserInput(value: boolean) {
		setShouldClearUserInput(value);
	}

	return (
		<>
			<ErrorBoundaryWrapper>
				{!sentence ? (
					<UserInput updateSentence={updateSentence} clearUserInput={shouldClearUserInput} />
				) : (
					<SubmitNewCollectionEntry
						sentence={sentence}
						addOptimisticVocabEntry={addOptimisticVocabEntry}
						updateSentence={updateSentence}
						updateShouldClearUserInput={updateShouldClearUserInput}
					/>
				)}
			</ErrorBoundaryWrapper>
			<EntryListing optimisticVocab={optimisticVocab} />
		</>
	);
}

export default VocabCreateAndDisplay;
