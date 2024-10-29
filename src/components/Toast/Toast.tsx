// https://www.radix-ui.com/primitives/docs/components/toast#abstract-parts

'use client';

import * as React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { XOctagon as ErrorIcon, AlertOctagon as InfoIcon, AlertTriangle as WarnIcon } from 'react-feather';
import styled from 'styled-components';

// https://github.com/radix-ui/primitives/discussions/1935#discussioncomment-4892471
interface ToastProps extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> {
	title?: string;
	content: string;
	toastType: ToastType;
}

type ToastType = 'error' | 'warn' | 'info';

var StyledToastTitle = styled(ToastPrimitive.ToastTitle)``;
var StyledToastDescription = styled(ToastPrimitive.ToastDescription)``;
var StyledToastRoot = styled(ToastPrimitive.Root)``;

function Toast({ title, content, toastType, ...props }: ToastProps) {
	let titleIcon: React.ReactNode;

	switch (toastType) {
		case 'error':
			titleIcon = <ErrorIcon />;
			break;

		case 'info':
			titleIcon = <InfoIcon />;
			break;
		case 'warn':
			titleIcon = <WarnIcon />;
			break;
	}

	return (
		<StyledToastRoot {...props}>
			<StyledToastTitle asChild>
				<h1>
					{titleIcon}
					{title}
				</h1>
			</StyledToastTitle>
			<StyledToastDescription>{content}</StyledToastDescription>
			<ToastPrimitive.Close aria-label='Close'>
				<span aria-hidden>×</span>
			</ToastPrimitive.Close>
		</StyledToastRoot>
	);
}

export default Toast;
