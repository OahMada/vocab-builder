import * as React from 'react';
import type { Metadata } from 'next';

import { auth } from '@/auth';

import SignupWrapper from '@/components/SignupWrapper';
import ErrorMessageProvider from '@/components/ErrorMessageProvider';
import LoggedInRedirect from '@/components/LoggedInRedirect';

export const metadata: Metadata = {
	title: 'Sign Up / Vocab Builder',
};

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
