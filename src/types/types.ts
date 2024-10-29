import { entrySelect } from '@/components/Vocab/getVocabList';
import { Prisma } from '@prisma/client';

export interface PhoneticSymbols {
	[key: string]: string;
}

export type VocabEntry = Prisma.VocabEntryGetPayload<{ select: typeof entrySelect }>;
