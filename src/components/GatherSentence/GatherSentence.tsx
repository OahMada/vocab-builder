'use client';

import * as React from 'react';

import UserInput from '@/components/UserInput';
import NewCollectionEntry from '@/components/NewCollectionEntry';
import { SENTENCE_TO_BE_PROCESSED } from '@/constants';

function GatherSentence() {
	let [sentence, setSentence] = React.useState<null | string>(null);

	React.useEffect(() => {
		let savedSentence = window.localStorage.getItem(SENTENCE_TO_BE_PROCESSED);
		if (savedSentence) {
			setSentence(savedSentence);
		}
	}, []);

	function updateSentence(text: string) {
		setSentence(text.trim());
		window.localStorage.setItem(SENTENCE_TO_BE_PROCESSED, text);
	}

	if (!sentence) {
		return <UserInput updateSentence={updateSentence} />;
	}
	return <NewCollectionEntry sentence={sentence} updateSentence={updateSentence} />;
}

export default GatherSentence;
