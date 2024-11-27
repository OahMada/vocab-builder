import * as React from 'react';

import { auth } from '@/auth';
import { errorParamsCache } from '@/lib/nuqs';

import LoginWrapper from '@/components/LoginWrapper';
import ErrorMessageProvider from '@/components/ErrorMessageProvider';
import LoggedInRedirect from '@/components/LoggedInRedirect';

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ error: string | undefined }> }) {
	let { error } = errorParamsCache.parse(await searchParams);

	let session = await auth();
	if (session?.user) {
		return <LoggedInRedirect />;
	}
	return (
		<ErrorMessageProvider>
			<LoginWrapper errorCode={error} />
		</ErrorMessageProvider>
	);
}
