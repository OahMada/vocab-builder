'use client';

import * as React from 'react';
import styled from 'styled-components';
import { useFormStatus } from 'react-dom';
import { usePathname } from 'next/navigation';

import { signout } from '@/actions';
import { useErrorMessageContext } from '@/components/ErrorMessageProvider';
import CustomLink from '@/components/CustomLink';
import Button from '@/components/Button';
import ButtonGroup from '@/components/ButtonGroup';

function UserInfoForm({ isAuthenticated }: { isAuthenticated: boolean }) {
	let pathname = usePathname();
	let { updateError } = useErrorMessageContext();
	async function clientAction() {
		let response = await signout();
		if (response) {
			updateError(response.errorMessage);
		}
	}

	return (
		<Btns as='form' action={clientAction}>
			<LogoutButton type='submit'>Logout</LogoutButton>
			{pathname !== '/setting' && (
				<CustomLink href='/setting' prefetch={true}>
					Settings
				</CustomLink>
			)}
			{isAuthenticated && pathname !== '/' && <CustomLink href='/'>Back to home</CustomLink>}
		</Btns>
	);
}

export default UserInfoForm;

interface OAuthLoginButtonProps extends React.ComponentPropsWithoutRef<'button'> {
	// className: string;
	children: React.ReactNode;
}

function LogoutButton({ children, ...props }: OAuthLoginButtonProps) {
	let { pending } = useFormStatus();

	return <Button {...props}>{pending ? 'Loading...' : children}</Button>;
}

var Btns = styled(ButtonGroup)`
	justify-content: flex-start;
`;
