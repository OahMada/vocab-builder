import * as React from 'react';

import { countVocab } from '@/actions';

async function VocabCount() {
	let vocabCountData = await countVocab();

	if ('errorMessage' in vocabCountData) {
		return <div>{vocabCountData.errorMessage}</div>;
	}

	return (
		<div>
			<p>{vocabCountData.data} records in total.</p>
		</div>
	);
}

export default VocabCount;
