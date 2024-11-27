'use client';

import * as React from 'react';

import { signout } from '@/actions';
import { useErrorMessageContext } from '@/components/ErrorMessageProvider';

function SettingForm() {
	let { updateError } = useErrorMessageContext();
	async function clientAction() {
		let response = await signout();
		if (response && 'errorMessage' in response) {
			updateError(response.errorMessage);
		}
	}

	return (
		<form action={clientAction}>
			<button type='button'>Edit Info</button>
			<button type='submit'>Logout</button>
		</form>
	);
}

export default SettingForm;
