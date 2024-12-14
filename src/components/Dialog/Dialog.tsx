import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import styled from 'styled-components';
import { X as CloseIcon } from 'react-feather';

import { H3Styles, DialogOverlayStyles, DialogContentStyles, DialogDescriptionStyles } from '@/lib/styled';
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
			<StyledTitle>{title}</StyledTitle>
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
	${DialogOverlayStyles}
`;

var StyledContent = styled(Dialog.Content)`
	${DialogContentStyles}
`;

var StyledDescription = styled(Dialog.Description)`
	${DialogDescriptionStyles}
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
