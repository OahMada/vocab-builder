'use client';

import * as React from 'react';
import Link from 'next/link';
import { SignInPageErrorParam } from '@auth/core/types';

import { useErrorMessageContext } from '@/components/ErrorMessageProvider';
import { signinErrors } from '@/constants';

import LoginForm from '@/components/LoginForm';
import OAuthLogin from '@/components/OAuthLogin';
import Toast from '@/components/Toast';

function LoginWrapper({ errorCode = 'default' }: { errorCode: SignInPageErrorParam | 'default' | null }) {
	let { errorMsg } = useErrorMessageContext();

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
			{errorMsg && (
				<React.Suspense fallback='loading'>
					<Toast toastType='error' content={errorMsg} />
				</React.Suspense>
			)}
			{errorCode && (
				<React.Suspense fallback='loading'>
					<Toast toastType='error' content={signinErrors[errorCode]} />
				</React.Suspense>
			)}
		</div>
	);
}

export default LoginWrapper;
