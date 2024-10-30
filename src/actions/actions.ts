'use server';

import prisma from '@/lib/db';
import { revalidateTag } from 'next/cache';

import { CreateVocabEntryInputSchema, UserInputSchema, VocabEntryIdSchema, VocabEntryUpdatingDataSchema } from '@/lib/dataValidation';
import { VOCAB_LIST_VALIDATION_TAG } from '@/constants';
import { constructZodErrorMessage } from '@/helpers';
import { errorHandling } from './helpers';

export async function createVocabEntry(
	entry: unknown
): Promise<{ data?: { note: string; sentencePlusPhoneticSymbols: string; translation: string }; errorMessage?: string }> {
	let result = CreateVocabEntryInputSchema.safeParse(entry);

	if (result.error) {
		let errorMessage = constructZodErrorMessage(result.error);

		return {
			errorMessage,
		};
	}

	let { sentence, translation, userEmail, note, sentencePlusPhoneticSymbols } = result.data;

	try {
		let response = await prisma.vocabEntry.create({
			data: {
				sentence,
				sentencePlusPhoneticSymbols,
				translation,
				note,
				user: {
					connect: {
						email: userEmail,
					},
				},
			},
		});
		return {
			data: {
				note: response.note,
				sentencePlusPhoneticSymbols: response.sentencePlusPhoneticSymbols,
				translation: response.translation,
			},
		};
	} catch (error) {
		return errorHandling(error);
	} finally {
		revalidateTag(VOCAB_LIST_VALIDATION_TAG);
	}
}

// export type FetchSentenceRecordReturn = ReturnType<typeof fetchSentenceRecord>;

export async function fetchSentenceRecord(text: unknown) {
	let result = UserInputSchema.safeParse(text);

	if (result.error) {
		let errorMessage = constructZodErrorMessage(result.error);
		return { errorMessage };
	}

	let sentence = result.data;

	let response = await prisma.vocabEntry.findUnique({
		where: {
			sentence,
		},
	});
	if (response) {
		return { errorMessage: 'The sentence you try to submit is already present in your collection.' };
	} else {
		return null;
	}
}

export async function deleteVocabEntry(id: unknown): Promise<{ data?: { sentence: string }; errorMessage?: string }> {
	let result = VocabEntryIdSchema.safeParse(id);

	if (result.error) {
		let errorMessage = constructZodErrorMessage(result.error);
		return { errorMessage };
	}

	try {
		let response = await prisma.vocabEntry.delete({
			where: {
				id: result.data,
			},
		});
		return {
			data: {
				sentence: response.sentence,
			},
		};
	} catch (error) {
		return errorHandling(error);
	} finally {
		revalidateTag(VOCAB_LIST_VALIDATION_TAG);
	}
}

export async function updateVocabEntry(data: unknown): Promise<{ data?: { translation: string; note: string }; errorMessage?: string }> {
	let result = VocabEntryUpdatingDataSchema.safeParse(data);
	if (result.error) {
		return {
			errorMessage: constructZodErrorMessage(result.error),
		};
	}

	let { id, translation, note } = result.data;

	try {
		let response = await prisma.vocabEntry.update({
			where: {
				id,
			},
			data: {
				translation,
				note,
			},
		});

		return {
			data: {
				translation: response.translation,
				note: response.note,
			},
		};
	} catch (error) {
		return errorHandling(error);
	} finally {
		revalidateTag(VOCAB_LIST_VALIDATION_TAG);
	}
}
