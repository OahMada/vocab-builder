'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { socialLogin } from '@/actions';

function OAuthLogin() {
	let searchParams = useSearchParams();
	let callbackUrl = searchParams.get('callbackUrl');

	async function clientAction(formData: FormData) {
		let rawFormData = formData.get('action');

		let response = await socialLogin(rawFormData, callbackUrl ?? '');
		if (response && 'errorMessage' in response) {
			console.log(response.errorMessage);
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
