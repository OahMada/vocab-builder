import * as React from 'react';

import Info from '@/components/Info';
import Setting from '@/components/Setting';
import Footer from '@/components/Footer';
import Vocab from '@/components/Vocab';
import MainContentWrapper from '@/components/MainContentWrapper';

export default function Home() {
	return (
		<MainContentWrapper>
			<Info>
				<Setting />
				<Footer />
			</Info>
			<Vocab />
		</MainContentWrapper>
	);
}
