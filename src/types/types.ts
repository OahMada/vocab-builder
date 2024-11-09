import { Prisma } from '@prisma/client';
import { z } from 'zod';

import { VocabEntryUpdatingDataSchema } from '@/lib/dataValidation';

export var entrySelect = {
	sentencePlusPhoneticSymbols: true,
	translation: true,
	note: true,
	id: true,
} satisfies Prisma.VocabEntrySelect;

export interface PhoneticSymbols {
	[key: string]: string;
}

export type VocabEntry = Prisma.VocabEntryGetPayload<{ select: typeof entrySelect }>;

export interface EntryUpdatingData {
	translation: string;
	note: string;
}

export interface RawFormData {
	[index: string]: FormDataEntryValue | null;
}

export type VocabEntryUpdatingData = z.infer<typeof VocabEntryUpdatingDataSchema>;
