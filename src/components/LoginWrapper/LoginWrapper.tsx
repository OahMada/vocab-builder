'use client';

import * as React from 'react';
import Link from 'next/link';
import { SignInPageErrorParam } from '@auth/core/types';
import { parseAsString, useQueryState } from 'nuqs';

import { useErrorMessageContext } from '@/components/ErrorMessageProvider';
import { SIGNINERRORS } from '@/constants';

import LoginForm from '@/components/LoginForm';
import OAuthLogin from '@/components/OAuthLogin';
import ErrorMsg from '@/components/ErrorMsg';
import AuthWrapper from '@/components/AuthWrapper';

function LoginWrapper({ errorCode = 'default' }: { errorCode: SignInPageErrorParam | 'default' | null }) {
	let { updateError } = useErrorMessageContext();
	// Clear error code in URL with Nuqs search params management
	let setError = useQueryState('error', parseAsString.withDefault('').withOptions({ clearOnDefault: true }))[1];

	React.useEffect(() => {
		if (errorCode) {
			updateError(SIGNINERRORS[errorCode]);
			setError('');
		}
	}, [errorCode, setError, updateError]);

	return (
		<AuthWrapper>
			<OAuthLogin />
			<LoginForm />
			<div>
				<p>
					Don&apos;t have an account yet?&nbsp;
					<Link href='/signup'>Sign Up</Link>
				</p>
			</div>
			<ErrorMsg />
		</AuthWrapper>
	);
}

export default LoginWrapper;
