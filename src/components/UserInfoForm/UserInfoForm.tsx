'use client';

import * as React from 'react';
import styled, { css } from 'styled-components';
import { useFormStatus } from 'react-dom';
import { usePathname } from 'next/navigation';

import { signout } from '@/actions';
import { useErrorMessageContext } from '@/components/ErrorMessageProvider';
import CustomLink from '@/components/CustomLink';
import Button from '@/components/Button';
import ButtonGroup from '@/components/ButtonGroup';

function UserInfoForm({ isAuthenticated, inMenu = false, closeMenu }: { isAuthenticated: boolean; inMenu?: boolean; closeMenu?: () => void }) {
	let pathname = usePathname();
	let { updateError } = useErrorMessageContext();
	async function clientAction() {
		let response = await signout();
		if (response) {
			updateError(response.errorMessage);
			return;
		}
		if (closeMenu) {
			closeMenu();
		}
	}

	return (
		<Btns as='form' action={clientAction} $inMenu={inMenu}>
			{pathname !== '/setting' && (
				<CustomLink
					href='/setting'
					prefetch={true}
					onClick={() => {
						if (closeMenu) {
							closeMenu();
						}
					}}
				>
					Settings
				</CustomLink>
			)}
			{isAuthenticated && pathname !== '/' && (
				<CustomLink
					href='/'
					onClick={() => {
						if (closeMenu) {
							closeMenu();
						}
					}}
				>
					Back to home
				</CustomLink>
			)}
			<LogoutButton type='submit'>Logout</LogoutButton>
		</Btns>
	);
}

export default UserInfoForm;

interface LogoutButtonProps extends React.ComponentPropsWithoutRef<'button'> {
	// className: string;
	children: React.ReactNode;
}

function LogoutButton({ children, ...props }: LogoutButtonProps) {
	let { pending } = useFormStatus();

	return <Button {...props}>{pending ? 'Loading...' : children}</Button>;
}

var Btns = styled(ButtonGroup)<{ $inMenu: boolean }>`
	${({ $inMenu }) => {
		if ($inMenu) {
			return css`
				flex-direction: column;
				align-items: stretch;
			`;
		} else {
			return css`
				justify-content: flex-start;
			`;
		}
	}}
`;
