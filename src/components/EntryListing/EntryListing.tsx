'use client';

import * as React from 'react';
import { useOptimisticVocabContext } from '@/components/OptimisticVocabProvider';

function EntryListing() {
	let { optimisticVocab } = useOptimisticVocabContext();

	return (
		<section>
			{optimisticVocab.map((entry) => {
				return (
					<div key={entry.id}>
						<p>{entry.sentence}</p>
						<p>{entry.translation}</p>
					</div>
				);
			})}
		</section>
	);
}

export default EntryListing;
