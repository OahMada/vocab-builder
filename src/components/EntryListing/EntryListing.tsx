import * as React from 'react';

import getVocabList from './getVocabList';

// var entrySelect = Prisma.validator<Prisma.VocabEntrySelect>()({
// 	sentence: true,
// 	translation: true,
// 	note: true,
// 	id: true,
// });

// type VocabEntrySelectType = Prisma.VocabEntryGetPayload<{ select: typeof entrySelect }>;

async function EntryListing() {
	let vocabList = await getVocabList();

	return (
		<section>
			{vocabList.map((entry) => {
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
