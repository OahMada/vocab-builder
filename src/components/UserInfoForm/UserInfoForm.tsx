'use client';

import * as React from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { signout } from '@/actions';
import { useErrorMessageContext } from '@/components/ErrorMessageProvider';

function UserInfoForm() {
	let pathname = usePathname();
	let { updateError } = useErrorMessageContext();
	async function clientAction() {
		let response = await signout();
		if (response) {
			updateError(response.errorMessage);
		}
	}

	return (
		<form action={clientAction}>
			{pathname !== '/setting' && <Link href='/setting'>Edit Info</Link>}
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
