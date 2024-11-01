'use client';

import * as React from 'react';
import Cookie from 'js-cookie';

import { VocabEntry } from '@/types';

import { SENTENCE_TEXT } from '@/constants';

import EntryListing from '@/components/EntryListing';
import SubmitNewCollectionEntry from '@/components/SubmitNewCollectionEntry';
import UserInput from '@/components/UserInput';
import ErrorBoundaryWrapper from '@/components/ErrorBoundaryWrapper';
import SWRConfigWrapper from '@/components/SWRConfigWrapper';

function VocabCreateAndDisplay({ vocabList, savedSentence }: { vocabList: VocabEntry[]; savedSentence: string | undefined }) {
	let [optimisticVocab, addOptimisticVocabEntry] = React.useOptimistic(vocabList, (currentState: VocabEntry[], newEntry: VocabEntry) => {
		if (currentState.length < 5) {
			return [newEntry, ...currentState];
		} else {
			return [newEntry, ...currentState.slice(0, -1)]; // Make sure there are always 5 entries that are returned.
		}
	});

	let [sentence, setSentence] = React.useState<string | undefined>(savedSentence);
	let [shouldClearUserInput, setShouldClearUserInput] = React.useState(false);

	function updateSentence(text: string) {
		setSentence(text);
		Cookie.set(SENTENCE_TEXT, text, {
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
					<SWRConfigWrapper>
						<SubmitNewCollectionEntry
							sentence={sentence}
							addOptimisticVocabEntry={addOptimisticVocabEntry}
							updateSentence={updateSentence}
							updateShouldClearUserInput={updateShouldClearUserInput}
						/>
					</SWRConfigWrapper>
				)}
			</ErrorBoundaryWrapper>
			<EntryListing vocab={optimisticVocab} />
			{/* TODO there should be a error boundary around this */}
		</>
	);
}

export default VocabCreateAndDisplay;
