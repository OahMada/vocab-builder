'use server';

import prisma from '@/lib/db';
import { revalidateTag } from 'next/cache';
import { Prisma } from '@prisma/client';

import { CreateVocabEntryInputSchema } from '@/lib/dataValidation';
import { VOCAB_LIST_VALIDATION_TAG } from '@/constants';
import { constructZodErrorMessage } from '@/helpers';

export async function createVocabEntry(entry: unknown) {
	let result = CreateVocabEntryInputSchema.safeParse(entry);

	if (result.error) {
		let errorMessage = constructZodErrorMessage(result.error);

		return {
			errorMessage,
		};
	}

	let { sentence, translation, userEmail, note } = result.data;

	try {
		let data = await prisma.vocabEntry.create({
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
		revalidateTag(VOCAB_LIST_VALIDATION_TAG);
		return {
			data: {
				note: data.note,
				sentence: data.sentence,
				translation: data.translation,
			},
		};
	} catch (error) {
		if (process.env.NODE_ENV === 'development') console.log(error);
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// The .code property can be accessed in a type-safe manner
			if (error.code === 'P2002') {
				return { errorMessage: 'The very sentence has already been saved. Please update the existing one instead.' };
			} else {
				return { errorMessage: `${error.message}. Code: ${error.code}` };
			}
		} else if (error instanceof Prisma.PrismaClientInitializationError) {
			return { errorMessage: `${error.message}. Code: ${error.errorCode}` };
		} else {
			// eslint-disable-next-line
			let err = error as any;
			return { errorMessage: err.message };
		}
	}
}
