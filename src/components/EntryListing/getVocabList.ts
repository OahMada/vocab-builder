import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';
import { unstable_cache } from 'next/cache';

import { DATABASE_USER_ID, VOCAB_LIST_VALIDATION_TAG } from '@/constants';

var entrySelect = {
	sentence: true,
	translation: true,
	note: true,
	id: true,
} satisfies Prisma.VocabEntrySelect;

var getVocabList = unstable_cache(
	() => {
		return prisma.vocabEntry.findMany({
			where: {
				userId: DATABASE_USER_ID,
			},
			select: entrySelect,
		});
	},
	[VOCAB_LIST_VALIDATION_TAG],
	{
		tags: [VOCAB_LIST_VALIDATION_TAG],
	}
);

export default getVocabList;
