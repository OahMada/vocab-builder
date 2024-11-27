import * as React from 'react';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';

import LoginWrapper from '@/components/LoginWrapper';
import ErrorMessageProvider from '@/components/ErrorMessageProvider';

export default async function SignInPage() {
	let session = await auth();
	if (session?.user) {
		redirect('/');
	}
	return (
		<ErrorMessageProvider>
			<LoginWrapper />
		</ErrorMessageProvider>
	);
}
