import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import styled from 'styled-components';
import { X as CloseIcon } from 'react-feather';

import { H3Styles } from '@/components/HeaderTag';
import Button from '@/components/Button';

type ContentElement = React.ElementRef<typeof Dialog.Content>;
interface ContentProps extends React.ComponentPropsWithoutRef<typeof Dialog.Content> {
	// className: string;
	children: React.ReactNode;
	title: string;
	description?: string;
}

export var DialogContent = React.forwardRef<ContentElement, ContentProps>(({ children, title, description, ...props }, forwardedRef) => (
	<Dialog.Portal>
		<StyledOverlay />
		<StyledContent {...props} ref={forwardedRef}>
			<StyledTitle as='h3'>{title}</StyledTitle>
			{description && <StyledDescription>{description}</StyledDescription>}
			{children}
			<Dialog.Close asChild>
				<StyledCloseBtn aria-label='Close'>
					<CloseIcon />
				</StyledCloseBtn>
			</Dialog.Close>
		</StyledContent>
	</Dialog.Portal>
));

DialogContent.displayName = 'DialogContent';

export var DialogRoot = Dialog.Root;
export var DialogTrigger = Dialog.Trigger;

var StyledOverlay = styled(Dialog.Overlay)`
	position: fixed;
	inset: 0;
	background-color: gray;
	opacity: 0.9;
`;

var StyledContent = styled(Dialog.Content)`
	background-color: white;

	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);

	width: 60vw;
	padding: var(--padding-big);
`;

var StyledDescription = styled(Dialog.Description)`
	margin-bottom: 10px;
`;

var StyledTitle = styled(Dialog.Title)`
	${H3Styles}
`;

var StyledCloseBtn = styled(Button)`
	border: none;
	background-color: unset;

	position: absolute;
	top: var(--padding-big);
	right: var(--padding-big);

	cursor: pointer;
`;
