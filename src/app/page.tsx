import * as React from 'react';
import { cookies } from 'next/headers';

import GatherSentence from '@/components/GatherSentence';
import Info from '@/components/Info';
import Setting from '@/components/Setting';
import Footer from '@/components/Footer';
import Vocab from '@/components/Vocab';
import EntryListing from '@/components/EntryListing';
import ContentWrapper from '@/components/ContentWrapper';
import { SENTENCE_TO_BE_PROCESSED } from '@/constants';

export default function Home() {
	let sentence = cookies().get(SENTENCE_TO_BE_PROCESSED)?.value || undefined;

	return (
		<ContentWrapper>
			<Info>
				<Setting />
				<Footer />
			</Info>
			<Vocab>
				<GatherSentence savedSentence={sentence} />
				<EntryListing />
			</Vocab>
		</ContentWrapper>
	);
}
