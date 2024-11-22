import { Prisma } from '@prisma/client';
// import { searchParamsCache } from '@/lib/nuqs';

import { entrySelect } from '@/lib/db';

export type VocabEntry = Prisma.VocabEntryGetPayload<{ select: typeof entrySelect }>;

export interface PhoneticSymbols {
	[key: string]: string;
}

export interface RawFormData {
	[index: string]: FormDataEntryValue | null;
}

// export type ParsedSearchParams = ReturnType<typeof searchParamsCache.parse>;
