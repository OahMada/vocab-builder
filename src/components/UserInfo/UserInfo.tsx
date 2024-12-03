'use client';

import * as React from 'react';
import styled from 'styled-components';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import ErrorMsg from '@/components/ErrorMsg';

function UserInfo({ children, isAuthenticated }: { children: React.ReactNode; isAuthenticated: boolean }) {
	let pathname = usePathname();
	return (
		<StyledDiv>
			{children}
			{isAuthenticated && pathname !== '/' && <Link href='/'>Back to home</Link>}
			<ErrorMsg />
		</StyledDiv>
	);
}

var StyledDiv = styled.div``;

export default UserInfo;
