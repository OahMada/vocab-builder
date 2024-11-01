import { entrySelect } from '@/components/Vocab/getVocabList';
import { Prisma } from '@prisma/client';

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
