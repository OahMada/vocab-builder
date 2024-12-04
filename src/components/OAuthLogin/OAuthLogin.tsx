'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { useFormStatus } from 'react-dom';

import { socialLogin } from '@/actions';
import { useErrorMessageContext } from '@/components/ErrorMessageProvider';

function OAuthLogin() {
	let searchParams = useSearchParams();
	let callbackUrl = searchParams.get('callbackUrl');
	let { updateError } = useErrorMessageContext();

	async function clientAction(formData: FormData) {
		updateError('');
		let rawFormData = formData.get('action');
		let response = await socialLogin(rawFormData, callbackUrl ?? '');
		if (response) {
			updateError(response.errorMessage);
		}
	}

	return (
		<form action={clientAction}>
			<OAuthLoginButton name='action' value='google'>
				Login with Google
			</OAuthLoginButton>
			<OAuthLoginButton name='action' value='github'>
				Login with Github
			</OAuthLoginButton>
		</form>
	);
}

export default OAuthLogin;

interface OAuthLoginButtonProps extends React.ComponentPropsWithoutRef<'button'> {
	// className: string;
	children: React.ReactNode;
	value: string;
}

function OAuthLoginButton({ children, value, ...props }: OAuthLoginButtonProps) {
	let { pending, data } = useFormStatus();
	let formData = data?.get('action');
	let isPending = pending && formData === value;

	return (
		<button {...props} value={value}>
			{isPending ? 'Loading...' : children}
		</button>
	);
}
