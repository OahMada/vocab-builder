import { Prisma } from '@prisma/client';
import { searchParamsCache } from '@/lib/nuqs';

export var entrySelect = {
	sentencePlusPhoneticSymbols: true,
	translation: true,
	note: true,
	id: true,
} satisfies Prisma.VocabEntrySelect;

export type VocabEntry = Prisma.VocabEntryGetPayload<{ select: typeof entrySelect }>;

export interface PhoneticSymbols {
	[key: string]: string;
}

export interface RawFormData {
	[index: string]: FormDataEntryValue | null;
}

export type ParsedSearchParams = ReturnType<typeof searchParamsCache.parse>;
