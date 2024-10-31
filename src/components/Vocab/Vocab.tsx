import * as React from 'react';
import { cookies } from 'next/headers';

import { SENTENCE_TEXT } from '@/constants';

import getVocabList from './getVocabList';

import StyledArticle from './StyledArticle';
import VocabCreateAndDisplay from '@/components/VocabCreateAndDisplay';

async function Vocab() {
	let vocabList = await getVocabList();
	let sentence = (await cookies()).get(SENTENCE_TEXT)?.value || undefined;

	return (
		<StyledArticle>
			<VocabCreateAndDisplay vocabList={vocabList} savedSentence={sentence} />
		</StyledArticle>
	);
}

export default Vocab;
