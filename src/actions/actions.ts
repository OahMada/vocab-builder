'use server';

import prisma from '@/lib/db';
import { revalidateTag } from 'next/cache';

import { CreateVocabEntryInputSchema } from '@/types';
import { VOCAB_LIST_VALIDATION_TAG } from '@/constants';

// export var validateCreateVocabEntryInput = (sentence: string, translation: string, userEmail: string, note?: string) => {
// 	return Prisma.validator<Prisma.VocabEntryCreateInput>()({
// 		sentence,
// 		translation,
// 		note,
// 		user: {
// 			connect: {
// 				email: userEmail,
// 			},
// 		},
// 	});
// };

export async function createVocabEntry(entry: unknown) {
	let result = CreateVocabEntryInputSchema.safeParse(entry);

	if (result.error) {
		console.log(result.error);
		return;
		// TODO return the error message and catch it on the client
	}

	let { sentence, translation, userEmail, note } = result.data;

	try {
		await prisma.vocabEntry.create({
			data: {
				sentence,
				translation,
				note,
				user: {
					connect: {
						email: userEmail,
					},
				},
			},
		});
	} catch (error) {
		console.log(error);
		// TODO
	}

	revalidateTag(VOCAB_LIST_VALIDATION_TAG);
}
