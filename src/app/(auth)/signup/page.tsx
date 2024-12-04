import * as React from 'react';
import type { Metadata } from 'next';

import { auth } from '@/auth';

import ErrorMessageProvider from '@/components/ErrorMessageProvider';
import PageRedirect from '@/components/PageRedirect';
import SignupForm from '@/components/SignupForm';
import ErrorMsg from '@/components/ErrorMsg';

export const metadata: Metadata = {
	title: 'Sign Up / Vocab Builder',
};

export default async function SignUpPage() {
	let session = await auth();
	if (session?.user) {
		return <PageRedirect doneAction='login' redirectPage='/' />;
	}

	return (
		<ErrorMessageProvider>
			<SignupForm />
			<ErrorMsg />
		</ErrorMessageProvider>
	);
}
