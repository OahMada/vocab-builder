'use client';

import * as React from 'react';
import Link from 'next/link';
import { SignInPageErrorParam } from '@auth/core/types';

import { useErrorMessageContext } from '@/components/ErrorMessageProvider';
import { signinErrors } from '@/constants';

import LoginForm from '@/components/LoginForm';
import OAuthLogin from '@/components/OAuthLogin';
import ErrorMsg from '@/components/ErrorMsg';

function LoginWrapper({ errorCode = 'default' }: { errorCode: SignInPageErrorParam | 'default' | null }) {
	let { updateError } = useErrorMessageContext();

	React.useEffect(() => {
		if (errorCode) {
			// TODO prevent the error from reappearing
			updateError(signinErrors[errorCode]);
		}
	}, [errorCode, updateError]);

	return (
		<div>
			<OAuthLogin />
			<LoginForm />
			<div>
				<p>
					Don&apos;t have an account yet?&nbsp;
					<Link href='/signup'>Sign Up</Link>
				</p>
			</div>
			<ErrorMsg />
		</div>
	);
}

export default LoginWrapper;
