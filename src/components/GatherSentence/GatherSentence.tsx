'use client';

import * as React from 'react';

import UserInput from '@/components/UserInput';
import NewCollectionEntry from '@/components/NewCollectionEntry';

function GatherSentence() {
	let [sentence, setSentence] = React.useState<null | string>(null);

	function updateSentence(text: string) {
		setSentence(text);
	}

	if (!sentence) {
		return <UserInput updateSentence={updateSentence} />;
	}
	return <NewCollectionEntry sentence={sentence} />;
}

export default GatherSentence;
