import * as React from 'react';
import { cookies } from 'next/headers';

import GatherSentence from '../../GatherSentence';
import { SENTENCE_TO_BE_PROCESSED } from '@/constants';
import StyledArticle from '@/components/Vocab/StyledArticle';
import EntryListingSkeleton from '@/components/EntryListing/EntryListingSkeleton';

function VocabLoading() {
	let sentence = cookies().get(SENTENCE_TO_BE_PROCESSED)?.value || undefined;

	return (
		<StyledArticle>
			<GatherSentence savedSentence={sentence} />
			<EntryListingSkeleton />
		</StyledArticle>
	);
}

export default VocabLoading;
