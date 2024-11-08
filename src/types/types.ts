import { Prisma } from '@prisma/client';

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

export type PageOptions = 'root' | 'vocab-listing';
