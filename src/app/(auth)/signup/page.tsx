import * as React from 'react';

import { auth } from '@/auth';

import SignupWrapper from '@/components/SignupWrapper';
import ErrorMessageProvider from '@/components/ErrorMessageProvider';
import LoggedInRedirect from '@/components/LoggedInRedirect';

export default async function SignUpPage() {
	let session = await auth();
	if (session?.user) {
		return <LoggedInRedirect />;
	}

	return (
		<ErrorMessageProvider>
			<SignupWrapper />
		</ErrorMessageProvider>
	);
}
