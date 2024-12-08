'use client';

import * as React from 'react';
import styled from 'styled-components';

interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
	children: string;
	className?: string;
}

var Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button({ className, children, ...props }, forwardedRef) {
	return (
		<StyledButton {...props} ref={forwardedRef} className={className}>
			{children}
		</StyledButton>
	);
});

var StyledButton = styled.button`
	border-width: 1px;
	border-radius: var(--border-radius-small);
	padding-top: 0;
	padding-bottom: 0;
	height: var(--header-height);
`;

export default Button;
