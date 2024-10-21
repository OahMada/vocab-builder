import * as React from 'react';

import Info from '@/components/Info';
import Setting from '@/components/Setting';
import Footer from '@/components/Footer';
import MainContentWrapper from '@/components/MainContentWrapper';
import VocabLoading from '@/components/Vocab/VocabLoading';

export default function Home() {
	return (
		<MainContentWrapper>
			<Info>
				<Setting />
				<Footer />
			</Info>
			<VocabLoading />
		</MainContentWrapper>
	);
}
