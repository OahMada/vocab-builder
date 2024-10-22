import * as React from 'react';

import Info from '@/components/Info';
import AppSetting from '@/components/AppSetting';
import Footer from '@/components/Footer';
import Vocab from '@/components/Vocab';
import MainContentWrapper from '@/components/MainContentWrapper';
import VocabLoading from '@/components/Vocab/VocabLoading';

export default function Home() {
	return (
		<MainContentWrapper>
			<Info>
				<AppSetting />
				<Footer />
			</Info>
			<React.Suspense fallback={<VocabLoading />}>
				<Vocab />
			</React.Suspense>
		</MainContentWrapper>
	);
}
