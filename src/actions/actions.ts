'use server';

import prisma from '@/lib/db';
import { revalidateTag } from 'next/cache';

import { CreateVocabEntryInputSchema, UserInputSchema, VocabEntryIdSchema } from '@/lib/dataValidation';
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
		let data = await prisma.vocabEntry.create({
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
				note: data.note,
				sentencePlusPhoneticSymbols: data.sentencePlusPhoneticSymbols,
				translation: data.translation,
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

	let data = await prisma.vocabEntry.findUnique({
		where: {
			sentence,
		},
	});
	if (data) {
		return { errorMessage: 'The sentence you try to submit is already present in your collection.' };
	} else {
		return null;
	}
}

export async function deleteVocabEntry(id: unknown): Promise<{ data?: { id: string; sentence: string }; errorMessage?: string }> {
	let result = VocabEntryIdSchema.safeParse(id);

	if (result.error) {
		let errorMessage = constructZodErrorMessage(result.error);
		return { errorMessage };
	}

	try {
		let deletedEntry = await prisma.vocabEntry.delete({
			where: {
				id: result.data,
			},
		});
		return {
			data: {
				id: deletedEntry.id,
				sentence: deletedEntry.sentence,
			},
		};
	} catch (error) {
		return errorHandling(error);
	} finally {
		revalidateTag(VOCAB_LIST_VALIDATION_TAG);
	}
}
