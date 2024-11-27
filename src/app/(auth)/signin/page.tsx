import * as React from 'react';

import { auth } from '@/auth';

import LoginWrapper from '@/components/LoginWrapper';
import ErrorMessageProvider from '@/components/ErrorMessageProvider';
import LoggedInRedirect from '@/components/LoggedInRedirect';

export default async function SignInPage() {
	let session = await auth();
	if (session?.user) {
		return <LoggedInRedirect />;
	}
	return (
		<ErrorMessageProvider>
			<LoginWrapper />
		</ErrorMessageProvider>
	);
}
