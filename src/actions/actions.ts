'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

import { CreateVocabEntryInputSchema } from '@/types';

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

	revalidatePath('/');
}
