import * as React from 'react';
import type { SearchParams } from 'nuqs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

import { getVocabData } from '@/actions';
import { ENTRIES_PER_PAGE } from '@/constants';
import { searchParamsCache } from '@/lib/nuqs';
import { auth } from '@/auth';

import EntryListing from '@/components/EntryListing';
import VocabDataProvider from '@/components/VocabDataProvider';
import ErrorMessageProvider from '@/components/ErrorMessageProvider';
import SearchVocab from '@/components/SearchVocab';
import SearchResults from '@/components/SearchResults';
import VocabCount from '@/components/VocabCount';

export default async function VocabListing({ searchParams }: { searchParams: Promise<SearchParams> }) {
	let session = await auth();
	if (!session?.user) {
		redirect('/signin?callbackUrl=/vocab-listing');
	}

	let { search } = searchParamsCache.parse(await searchParams);

	let vocabData = await getVocabData(ENTRIES_PER_PAGE, session.user.id);

	if ('errorMessage' in vocabData) {
		return <div>{vocabData.errorMessage}</div>;
	}

	let initialHaveMoreData = vocabData.data.length === ENTRIES_PER_PAGE; // if lesser, there is no more data.
	let lastEntryId = vocabData.data.at(-1)?.id;

	return (
		<div>
			<div>
				<SearchVocab />
				<Link href='/'>Back to home</Link>
			</div>
			<div>
				<React.Suspense fallback={<p>Loading...</p>}>
					<VocabCount />
				</React.Suspense>
				<React.Suspense fallback={<p>Loading...</p>}>
					<ErrorMessageProvider>
						<VocabDataProvider initialState={vocabData.data}>
							<EntryListing initialCursor={lastEntryId} initialHaveMoreData={initialHaveMoreData} userId={session.user.id} />
						</VocabDataProvider>
					</ErrorMessageProvider>
				</React.Suspense>
			</div>

			{search && (
				<React.Suspense fallback={<p>Searching...</p>}>
					<SearchResults searchTerm={search} />
				</React.Suspense>
			)}
		</div>
	);
}
