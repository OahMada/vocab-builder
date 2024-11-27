'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';

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
		if (response && 'errorMessage' in response) {
			updateError(response.errorMessage);
		}
	}

	return (
		<form action={clientAction}>
			<button name='action' value='google'>
				Login with Google
			</button>
			<button name='action' value='github'>
				Login with Github
			</button>
		</form>
	);
}

export default OAuthLogin;
