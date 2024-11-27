import * as React from 'react';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';

import SignupWrapper from '@/components/SignupWrapper';
import ErrorMessageProvider from '@/components/ErrorMessageProvider';

export default async function SignUpPage() {
	let session = await auth();
	if (session?.user) {
		redirect('/');
	}

	return (
		<ErrorMessageProvider>
			<SignupWrapper />
		</ErrorMessageProvider>
	);
}
