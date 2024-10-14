import * as React from 'react';
import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';

import { DATABASE_USER_ID } from '@/constants';

// var entrySelect = Prisma.validator<Prisma.VocabEntrySelect>()({
// 	sentence: true,
// 	translation: true,
// 	note: true,
// 	id: true,
// });
var entrySelect = {
	sentence: true,
	translation: true,
	note: true,
	id: true,
} satisfies Prisma.VocabEntrySelect;

// type VocabEntrySelectType = Prisma.VocabEntryGetPayload<{ select: typeof entrySelect }>;

async function EntryListing() {
	let vocabList = await prisma.vocabEntry.findMany({
		where: {
			userId: DATABASE_USER_ID,
		},
		select: entrySelect,
	});

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
