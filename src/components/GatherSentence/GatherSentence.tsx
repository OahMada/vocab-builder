'use client';

import * as React from 'react';
import Cookie from 'js-cookie';

import UserInput from '@/components/UserInput';
import NewCollectionEntry from '@/components/NewCollectionEntry';
import { SENTENCE_TO_BE_PROCESSED } from '@/constants';

function GatherSentence({ savedSentence }: { savedSentence?: string }) {
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

	if (!sentence) {
		return <UserInput updateSentence={updateSentence} clearUserInput={shouldClearUserInput} />;
	}
	return <NewCollectionEntry sentence={sentence} updateSentence={updateSentence} updateShouldClearUserInput={updateShouldClearUserInput} />;
}

export default GatherSentence;
