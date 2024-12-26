// https://www.radix-ui.com/primitives/docs/components/toast#abstract-parts

'use client';

import * as React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { X as CloseIcon } from 'react-feather';
import styled from 'styled-components';

import { closeIconStyles } from '@/lib/styled';

import HeaderTag from '@/components/HeaderTag';
import Button from '@/components/Button';

// https://github.com/radix-ui/primitives/discussions/1935#discussioncomment-4892471
interface ToastProps extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> {
	title?: string;
	content: string;
	toastType: ToastType;
}

type ToastType = 'error' | 'warn' | 'info';

function Toast({ title, content, toastType, ...props }: ToastProps) {
	if (!title) {
		switch (toastType) {
			case 'error':
				title = 'Error:';
				break;

			case 'info':
				title = 'Info:';
				break;
			case 'warn':
				title = 'Warn:';
				break;
		}
	}

	return (
		<StyledToastRoot {...props}>
			<ToastPrimitive.ToastTitle asChild>
				<HeaderTag level={4}>{title}</HeaderTag>
			</ToastPrimitive.ToastTitle>
			<StyledToastDescription asChild={true}>
				<p>{content}</p>
			</StyledToastDescription>
			<ToastPrimitive.Close aria-label='Close' asChild={true}>
				<StyledCloseBtn>
					<CloseIcon />
				</StyledCloseBtn>
			</ToastPrimitive.Close>
		</StyledToastRoot>
	);
}

export default Toast;

var StyledToastRoot = styled(ToastPrimitive.Root)`
	position: relative;
	display: flex;
	flex-direction: column;
	box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
	border-radius: var(--border-radius-normal);
	padding: var(--padding-normal);
	background-color: white;
`;

var StyledToastDescription = styled(ToastPrimitive.ToastDescription)`
	margin-top: 5px;
`;

var StyledCloseBtn = styled(Button)`
	${closeIconStyles}
	top: var(--padding-small);
	right: var(--padding-small);
`;
