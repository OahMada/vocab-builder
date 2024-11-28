import * as React from 'react';

import { auth } from '@/auth';
import { countVocab } from '@/actions';

async function VocabCount() {
	let session = await auth();
	if (!session?.user) {
		throw new Error('Not authenticated.');
	}
	let vocabCountData = await countVocab(session?.user.id);

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
