'use server';

import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export interface NewEntry extends Pick<Prisma.VocabEntryCreateInput, 'sentence' | 'translation' | 'note'> {
	userEmail: string;
}

export async function createVocabEntry({ sentence, translation, note, userEmail }: NewEntry) {
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

	revalidatePath('/');
}
