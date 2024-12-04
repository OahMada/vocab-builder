'use server';

import { revalidateTag, unstable_cache } from 'next/cache';
// https://github.com/prisma/prisma/issues/6718#issuecomment-824893638
// import { ObjectId } from 'bson';

import prisma, { prismaErrorHandling, entrySelect } from '@/lib/db';
import { auth } from '@/auth';

import { CreateVocabEntryInputSchema, UserInputSchema, VocabEntryStringSchema, VocabEntryUpdatingDataSchema } from '@/lib/dataValidation';
import { ENTRIES_PER_PAGE, VOCAB_LIST_VALIDATION_TAG } from '@/constants';
import { constructZodErrorMessage, delay } from '@/helpers';
import { VocabEntry } from '@/types';

export async function createVocabEntry(
	entry: unknown
): Promise<{ data: { note: string; sentencePlusPhoneticSymbols: string; translation: string; id: string } } | { errorMessage: string }> {
	let session = await auth();
	if (!session?.user) {
		return {
			errorMessage: 'Not authenticated.',
		};
	}

	let result = CreateVocabEntryInputSchema.safeParse(entry);

	if (result.error) {
		let errorMessage = constructZodErrorMessage(result.error);

		return {
			errorMessage,
		};
	}

	let { sentence, translation, note, sentencePlusPhoneticSymbols } = result.data;

	try {
		let response = await prisma.vocabEntry.create({
			data: {
				sentence,
				sentencePlusPhoneticSymbols,
				translation,
				note,
				user: {
					connect: {
						id: session.user.id,
					},
				},
			},
			select: entrySelect,
		});
		return {
			data: response,
		};
	} catch (error) {
		return prismaErrorHandling(error);
	} finally {
		revalidateTag(VOCAB_LIST_VALIDATION_TAG);
	}
}

export type CreateVocabEntryReturnType = ReturnType<typeof createVocabEntry>;

export async function fetchSentenceRecord(text: unknown) {
	let session = await auth();
	if (!session?.user) {
		return {
			errorMessage: 'Not authenticated.',
		};
	}

	let result = UserInputSchema.safeParse(text);

	if (result.error) {
		let errorMessage = constructZodErrorMessage(result.error);
		return { errorMessage };
	}

	let sentence = result.data;

	let response = await prisma.vocabEntry.findUnique({
		where: {
			sentence,
			userId: session.user.id,
		},
	});
	if (response) {
		return { errorMessage: 'The sentence you try to submit is already present in your collection.' };
	} else {
		return null;
	}
}

export async function deleteVocabEntry(id: unknown): Promise<{ data: VocabEntry } | { errorMessage: string }> {
	let session = await auth();
	if (!session?.user) {
		return {
			errorMessage: 'Not authenticated.',
		};
	}

	let result = VocabEntryStringSchema.safeParse(id);

	if (result.error) {
		let errorMessage = constructZodErrorMessage(result.error);
		return { errorMessage };
	}

	if (process.env.NODE_ENV === 'development') await delay(3000);

	try {
		let response = await prisma.vocabEntry.delete({
			where: {
				id: result.data,
				userId: session.user.id,
			},

			select: entrySelect,
		});
		return {
			data: response,
		};
	} catch (error) {
		return prismaErrorHandling(error);
	} finally {
		revalidateTag(VOCAB_LIST_VALIDATION_TAG);
	}
}

export type DeleteVocabEntryReturnType = ReturnType<typeof deleteVocabEntry>;

export async function updateVocabEntry(data: unknown): Promise<{ data: VocabEntry } | { errorMessage: string }> {
	let session = await auth();
	if (!session?.user) {
		return {
			errorMessage: 'Not authenticated.',
		};
	}

	let result = VocabEntryUpdatingDataSchema.safeParse(data);
	if (result.error) {
		return {
			errorMessage: constructZodErrorMessage(result.error),
		};
	}

	let { id, translation, note } = result.data;

	try {
		// throw new Error('error');
		let response = await prisma.vocabEntry.update({
			where: {
				id,
				userId: session.user.id,
			},
			data: {
				translation,
				note,
			},
			select: entrySelect,
		});
		return {
			data: response,
		};
	} catch (error) {
		return prismaErrorHandling(error);
	} finally {
		revalidateTag(VOCAB_LIST_VALIDATION_TAG);
	}
}

export type UpdateVocabEntryReturnType = ReturnType<typeof updateVocabEntry>;

export var getVocabData: (limit: number, userId: string) => Promise<{ data: VocabEntry[] } | { errorMessage: string }> = unstable_cache(
	async (limit, userId) => {
		if (process.env.NODE_ENV === 'development') await delay(3000);

		try {
			let data = await prisma.vocabEntry.findMany({
				where: {
					userId,
				},
				select: entrySelect,
				orderBy: {
					createdAt: 'desc',
				},
				take: limit,
			});
			return { data };
		} catch (error) {
			return prismaErrorHandling(error);
		}
	},
	[VOCAB_LIST_VALIDATION_TAG],
	{
		tags: [VOCAB_LIST_VALIDATION_TAG],
	}
);

export var getPaginatedVocabData: (cursor: string, userId: string | undefined) => Promise<{ data: VocabEntry[] } | { errorMessage: string }> =
	unstable_cache(
		async (cursor, userId) => {
			if (!userId) {
				return {
					errorMessage: 'Not authenticated.',
				};
			}

			if (process.env.NODE_ENV === 'development') await delay(3000);

			try {
				let data = await prisma.vocabEntry.findMany({
					where: {
						userId,
					},
					select: entrySelect,
					orderBy: {
						createdAt: 'desc',
					},
					take: ENTRIES_PER_PAGE,
					skip: 1,
					cursor: {
						id: cursor,
					},
				});
				return { data };
			} catch (error) {
				return prismaErrorHandling(error);
			}
		},
		[VOCAB_LIST_VALIDATION_TAG],
		{
			tags: [VOCAB_LIST_VALIDATION_TAG],
		}
	);

export var performVocabSearch: (searchTerm: unknown, userId: string) => Promise<{ data: VocabEntry[] } | { errorMessage: string }> = unstable_cache(
	async function (searchTerm, userId) {
		let result = VocabEntryStringSchema.safeParse(searchTerm);
		if (result.error) {
			return {
				errorMessage: constructZodErrorMessage(result.error),
			};
		}
		let term = result.data;
		if (process.env.NODE_ENV === 'development') await delay(3000);

		try {
			let data = (await prisma.vocabEntry.aggregateRaw({
				pipeline: [
					{
						$search: {
							index: 'full-text-index',
							compound: {
								filter: [
									{
										equals: {
											// https://github.com/prisma/prisma/issues/15013#issuecomment-1381397966
											value: { $oid: userId },
											path: 'user_id',
										},
									},
								],
								should: [
									{
										autocomplete: {
											path: 'sentence',
											query: term,
											tokenOrder: 'any',
											fuzzy: {
												maxEdits: 2,
												prefixLength: 1,
												maxExpansions: 256,
											},
										},
									},
									{
										text: {
											query: term,
											path: 'note',
										},
									},
									{
										text: {
											query: term,
											path: 'translation',
										},
									},
								],
								minimumShouldMatch: 1,
							},
							sort: { score: { $meta: 'searchScore' } },
						},
					},

					{ $limit: ENTRIES_PER_PAGE },
					{
						$addFields: {
							id: { $toString: '$_id' },
							sentencePlusPhoneticSymbols: '$sentence_plus_phonetic_symbols',
						},
					},
					{
						$project: {
							_id: 0,
							id: 1,
							sentencePlusPhoneticSymbols: 1,
							translation: 1,
							note: 1,
							score: { $meta: 'searchScore' },
						},
					},
				],
			})) as unknown as VocabEntry[];
			return { data };
		} catch (error) {
			return prismaErrorHandling(error);
		}
	},
	[VOCAB_LIST_VALIDATION_TAG],
	{
		tags: [VOCAB_LIST_VALIDATION_TAG],
	}
);

export var countVocab: (userId: string) => Promise<{ data: number } | { errorMessage: string }> = unstable_cache(
	async function (userId) {
		try {
			let vocabCount = await prisma.vocabEntry.count({
				where: {
					userId,
				},
			});
			return {
				data: vocabCount,
			};
		} catch (error) {
			return prismaErrorHandling(error);
		}
	},
	[VOCAB_LIST_VALIDATION_TAG],
	{
		tags: [VOCAB_LIST_VALIDATION_TAG],
	}
);

export async function exportData(): Promise<{ data: string } | { errorMessage: string }> {
	let session = await auth();
	if (!session?.user) {
		return {
			errorMessage: 'Not authenticated.',
		};
	}
	let { id: userId } = session.user;

	let vocabData: VocabEntry[];
	try {
		vocabData = await prisma.vocabEntry.findMany({
			where: { userId },
			select: entrySelect,
		});
	} catch (error) {
		return prismaErrorHandling(error);
	}

	let data = `
#separator:tab
#html:true
#columns:sentence\ttranslation\tnote
#notetype:vocab
${vocabData
	.map((entry) => {
		return `${entry.sentencePlusPhoneticSymbols}\t${entry.translation}\t${entry.note}\n`;
	})
	.join('')}
`;

	return {
		data,
	};
}

export type ExportDataReturnType = ReturnType<typeof exportData>;
