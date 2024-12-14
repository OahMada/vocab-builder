'use client';

import { ToastViewport, ToastProvider } from '@radix-ui/react-toast';
import * as React from 'react';
import styled from 'styled-components';

var StyledToastViewport = styled(ToastViewport)`
	position: fixed;
	bottom: 0;
	right: 0;
	display: flex;
	flex-direction: column;
	padding: var(--padding-big);
	gap: var(--gap-normal);
	width: 390px;
	max-width: 100vw;
	list-style: none;
`;

function ToastWrapper({ children }: { children: React.ReactNode }) {
	return (
		<ToastProvider>
			{children}
			<StyledToastViewport />
		</ToastProvider>
	);
}

export default ToastWrapper;
