import * as React from 'react';
import type { Metadata } from 'next';

import { auth } from '@/auth';
import { errorParamsCache } from '@/lib/nuqs';

import LoginWrapper from '@/components/LoginWrapper';
import ErrorMessageProvider from '@/components/ErrorMessageProvider';
import PageRedirect from '@/components/PageRedirect';

export const metadata: Metadata = {
	title: 'Sign In / Vocab Builder',
};

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ error: string | undefined }> }) {
	let { error } = errorParamsCache.parse(await searchParams);

	let session = await auth();
	if (session?.user) {
		return <PageRedirect doneAction='login' redirectPage='/' />;
	}
	return (
		<ErrorMessageProvider>
			<LoginWrapper errorCode={error} />
		</ErrorMessageProvider>
	);
}
