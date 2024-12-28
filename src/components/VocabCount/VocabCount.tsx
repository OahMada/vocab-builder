import * as React from 'react';

import { auth } from '@/auth';
import { countVocab } from '@/actions';
import StyledDiv from './StyledDiv';

async function VocabCount() {
	let session = await auth();
	if (!session?.user) {
		throw new Error('Not authenticated.');
	}
	let vocabCountData = await countVocab(session?.user.id);

	if ('errorMessage' in vocabCountData) {
		return <StyledDiv>{vocabCountData.errorMessage}</StyledDiv>;
	}

	return (
		<StyledDiv>
			<p>{vocabCountData.data} records in total.</p>
		</StyledDiv>
	);
}

export default VocabCount;

export function VocabCountFallBack() {
	return (
		<StyledDiv>
			<p>_ records in total.</p>
		</StyledDiv>
	);
}
