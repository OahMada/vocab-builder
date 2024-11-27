'use client';

import * as React from 'react';
import Link from 'next/link';

import { useErrorMessageContext } from '@/components/ErrorMessageProvider';

import LoginForm from '@/components/LoginForm';
import OAuthLogin from '@/components/OAuthLogin';
import Toast from '@/components/Toast';

function LoginWrapper() {
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
			{errorMsg && <Toast toastType='error' content={errorMsg} />}
		</div>
	);
}

export default LoginWrapper;
