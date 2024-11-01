import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';
import { unstable_cache } from 'next/cache';
import { delay } from '@/helpers';

import { DATABASE_USER_ID, VOCAB_LIST_VALIDATION_TAG } from '@/constants';

export var entrySelect = {
	sentencePlusPhoneticSymbols: true,
	translation: true,
	note: true,
	id: true,
} satisfies Prisma.VocabEntrySelect;

var getVocabList = unstable_cache(
	async () => {
		if (process.env.NODE_ENV === 'development') await delay(3000);
		return prisma.vocabEntry.findMany({
			where: {
				userId: DATABASE_USER_ID,
			},
			select: entrySelect,
			orderBy: {
				createdAt: 'desc',
			},
			take: 5,
		});
	},
	[VOCAB_LIST_VALIDATION_TAG],
	{
		tags: [VOCAB_LIST_VALIDATION_TAG],
	}
);

export default getVocabList;

// TODO do I need error handling here? Yes
