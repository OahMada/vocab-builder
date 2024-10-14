'use client';

import * as React from 'react';
import Cookie from 'js-cookie';

import UserInput from '@/components/UserInput';
import NewCollectionEntry from '@/components/NewCollectionEntry';
import { SENTENCE_TO_BE_PROCESSED } from '@/constants';
import { UserInputSchema } from '@/types';

function GatherSentence({ savedSentence }: { savedSentence?: string }) {
	let [sentence, setSentence] = React.useState<string | undefined>(savedSentence);

	function updateSentence(text: string) {
		let result = UserInputSchema.safeParse(text);

		if (result.error) {
			console.log(result.error);
			// TODO better error formatting
			// TODO toast to show the error
		} else {
			setSentence(result.data);
			Cookie.set(SENTENCE_TO_BE_PROCESSED, result.data, {
				expires: 1000,
			});
		}
	}

	if (!sentence) {
		return <UserInput updateSentence={updateSentence} />;
	}
	return <NewCollectionEntry sentence={sentence} updateSentence={updateSentence} />;
}

export default GatherSentence;
