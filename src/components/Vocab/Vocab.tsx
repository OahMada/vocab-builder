import * as React from 'react';
import { cookies } from 'next/headers';

import getVocabList from './getVocabList';
import GatherSentence from '../GatherSentence';
import EntryListing from '../EntryListing';
import { SENTENCE_TO_BE_PROCESSED } from '@/constants';
import StyledArticle from './StyledArticle';
import OptimisticVocabProvider from '../OptimisticVocabProvider';
import ErrorBoundaryWrapper from '../GatherSentence/ErrorBoundaryWrapper';

async function Vocab() {
	let vocabList = await getVocabList();
	let sentence = cookies().get(SENTENCE_TO_BE_PROCESSED)?.value || undefined;

	return (
		<StyledArticle>
			<OptimisticVocabProvider vocabList={vocabList}>
				<ErrorBoundaryWrapper>
					<GatherSentence savedSentence={sentence} />
				</ErrorBoundaryWrapper>
				<EntryListing />
			</OptimisticVocabProvider>
		</StyledArticle>
	);
}

export default Vocab;
