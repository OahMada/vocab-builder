'use client';

import * as React from 'react';
import Cookie from 'js-cookie';

import UserInput from '@/components/UserInput';
import NewCollectionEntry from '@/components/NewCollectionEntry';
import { SENTENCE_TO_BE_PROCESSED } from '@/constants';

function GatherSentence({ savedSentence }: { savedSentence?: string }) {
	let [sentence, setSentence] = React.useState<string | undefined>(savedSentence);

	function updateSentence(text: string) {
		let trimmedText = text.trim();
		setSentence(trimmedText);
		Cookie.set(SENTENCE_TO_BE_PROCESSED, trimmedText, {
			expires: 1000,
		});
	}

	if (!sentence) {
		return <UserInput updateSentence={updateSentence} />;
	}
	return <NewCollectionEntry sentence={sentence} updateSentence={updateSentence} />;
}

export default GatherSentence;
