'use client';

import * as React from 'react';
import styled from 'styled-components';
import { Menu } from 'react-feather';

import UserInfoForm from '@/components/UserInfoForm';
import Button from '@/components/Button';
import ErrorMessageProvider from '@/components/ErrorMessageProvider';
import DropdownMenuContent, { DropdownMenuItem, DropdownRoot, DropdownMenuTrigger } from '@/components/Dropdown';

function HeaderMenu() {
	let [open, setOpen] = React.useState(false);

	let closeMenu = React.useCallback(() => {
		setOpen(false);
	}, []);

	return (
		<DropdownRoot open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild={true}>
				<MenuButton>
					<Menu />
				</MenuButton>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem asChild={true}>
					<ErrorMessageProvider>
						<UserInfoForm isAuthenticated={true} inMenu={true} closeMenu={closeMenu} />
					</ErrorMessageProvider>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownRoot>
	);
}

export default HeaderMenu;

var MenuButton = styled(Button)`
	border: none;
	background-color: transparent;
	padding: 0;
`;
