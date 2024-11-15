import * as React from 'react';
import { cookies } from 'next/headers';

import { SENTENCE_TEXT } from '@/constants';

import { getVocabData } from '@/actions';

import StyledArticle from '@/components/StyledArticle';
import VocabCreateAndDisplay from '@/components/VocabCreateAndDisplay';

async function Vocab() {
	let vocabData = await getVocabData(6);
	let sentence = (await cookies()).get(SENTENCE_TEXT)?.value || undefined;

	if ('errorMessage' in vocabData) {
		return <div>{vocabData.errorMessage}</div>;
	}
	return (
		<StyledArticle>
			<VocabCreateAndDisplay vocabData={vocabData.data} savedSentence={sentence} />
		</StyledArticle>
	);
}

export default Vocab;
