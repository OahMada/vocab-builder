import { Prisma } from '@prisma/client';
// import { searchParamsCache } from '@/lib/nuqs';
import { User } from 'next-auth';

import { entrySelect, userSelect } from '@/lib/db';

export type VocabEntry = Prisma.VocabEntryGetPayload<{ select: typeof entrySelect }>;
export type DatabaseUser = Prisma.UserGetPayload<{ select: typeof userSelect }>;

export interface PhoneticSymbols {
	[key: string]: string;
}

export interface RawFormData {
	[index: string]: FormDataEntryValue | null;
}

// export type ParsedSearchParams = ReturnType<typeof searchParamsCache.parse>;

export interface UserInfo extends User {
	password: string | null;
}
