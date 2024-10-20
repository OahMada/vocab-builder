import * as React from 'react';

import Info from '@/components/Info';
import Setting from '@/components/Setting';
import Footer from '@/components/Footer';
import Vocab from '@/components/Vocab';
import ContentWrapper from '@/components/ContentWrapper';

export default function Home() {
	return (
		<ContentWrapper>
			<Info>
				<Setting />
				<Footer />
			</Info>
			<Vocab />
		</ContentWrapper>
	);
}
