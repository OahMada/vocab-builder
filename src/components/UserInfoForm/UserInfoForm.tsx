'use client';

import * as React from 'react';
import { useFormStatus } from 'react-dom';

import { signout } from '@/actions';
import { useErrorMessageContext } from '@/components/ErrorMessageProvider';

function UserInfoForm() {
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
			<LogoutButton type='submit'>Logout</LogoutButton>
		</form>
	);
}

export default UserInfoForm;

interface OAuthLoginButtonProps extends React.ComponentPropsWithoutRef<'button'> {
	// className: string;
	children: React.ReactNode;
}

function LogoutButton({ children, ...props }: OAuthLoginButtonProps) {
	let { pending } = useFormStatus();

	return <button {...props}>{pending ? 'Loading...' : children}</button>;
}
