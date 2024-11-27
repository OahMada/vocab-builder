'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function LoggedInRedirect() {
	let router = useRouter();

	React.useEffect(() => {
		window.setTimeout(() => {
			router.replace('/');
		}, 3000);
	}, [router]);

	return (
		<div>
			<p>You&apos;ve already logged in and will be redirected to home page in 3s.</p>
			<p>
				If you are not redirected automatically, follow <Link href='/'>this link.</Link>
			</p>
		</div>
	);
}

export default LoggedInRedirect;
