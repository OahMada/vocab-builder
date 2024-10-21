import * as React from 'react';
import { cookies } from 'next/headers';

import GatherSentence from '../../GatherSentence';
import { SENTENCE_TO_BE_PROCESSED } from '@/constants';
import StyledArticle from '@/components/Vocab/StyledArticle';
import EntryListingSkeleton from '@/components/EntryListing/EntryListingSkeleton';

function VocabLoading() {
	let sentence = cookies().get(SENTENCE_TO_BE_PROCESSED)?.value || undefined;

	// should I include ErrorBoundary here? Is it causing the slow down? No. Fallback can only render on the client, so the user has to wait for the whole app to finish downloading to see the fallback UI.

	return (
		<StyledArticle>
			<GatherSentence savedSentence={sentence} />
			<EntryListingSkeleton />
		</StyledArticle>
	);
}

export default VocabLoading;
