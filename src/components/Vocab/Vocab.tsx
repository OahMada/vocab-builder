import * as React from 'react';
import { cookies } from 'next/headers';

import getVocabList from './getVocabList';
import { SENTENCE_TO_BE_PROCESSED } from '@/constants';
import StyledArticle from './StyledArticle';
import VocabCreateAndDisplay from '@/components/VocabCreateAndDisplay';

async function Vocab() {
	let vocabList = await getVocabList();
	let sentence = cookies().get(SENTENCE_TO_BE_PROCESSED)?.value || undefined;

	return (
		<StyledArticle>
			<VocabCreateAndDisplay vocabList={vocabList} savedSentence={sentence} />
		</StyledArticle>
	);
}

export default Vocab;
