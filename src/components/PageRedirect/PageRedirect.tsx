'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const DoneActionMap = {
	login: "You've already logged in and will be redirected to home page in 3s.",
	signup: "You've successfully signed up and will be redirected to login page in 3s.",
};

function PageRedirect({ doneAction, redirectPage }: { doneAction: keyof typeof DoneActionMap; redirectPage: string }) {
	let router = useRouter();

	React.useEffect(() => {
		window.setTimeout(() => {
			router.replace('/');
		}, 3000);
	}, [router]);

	return (
		<div>
			<p>{DoneActionMap[doneAction]}</p>
			<p>
				If you are not redirected automatically, follow <Link href={redirectPage}>this link.</Link>
			</p>
		</div>
	);
}

export default PageRedirect;
