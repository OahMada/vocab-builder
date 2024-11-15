import * as React from 'react';

import Vocab from '@/components/Vocab';

export default function Home() {
	return (
		<React.Suspense fallback='Loading...'>
			{/* TODO a skeleton loading component for the fallback, which includes an input box*/}
			<Vocab />
		</React.Suspense>
	);
}
