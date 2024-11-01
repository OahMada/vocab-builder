import * as React from 'react';

import Info from '@/components/Info';
import AppSetting from '@/components/AppSetting';
import Footer from '@/components/Footer';
import Vocab from '@/components/Vocab';
import MainContentWrapper from '@/components/MainContentWrapper';

export default function Home() {
	return (
		<MainContentWrapper>
			<Info>
				<AppSetting />
				<Footer />
			</Info>
			<React.Suspense fallback='Loading...'>
				{/* TODO ~~a skeleton loading component for the fallback, which includes an input box~~ maybe I don't need a suspense here after all */}
				<Vocab />
			</React.Suspense>
		</MainContentWrapper>
	);
}
