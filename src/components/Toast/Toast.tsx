// https://www.radix-ui.com/primitives/docs/components/toast#abstract-parts

import * as React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';

function Toast({ title, content, ...props }: { title?: string; content: string; [index: string]: string | undefined }) {
	console.log('rendering toast');

	return (
		<ToastPrimitive.Root {...props}>
			{title && <ToastPrimitive.Title>{title}</ToastPrimitive.Title>}
			<ToastPrimitive.Description>{content}</ToastPrimitive.Description>
			<ToastPrimitive.Close aria-label='Close'>
				<span aria-hidden>×</span>
			</ToastPrimitive.Close>
		</ToastPrimitive.Root>
	);
}

export default Toast;
