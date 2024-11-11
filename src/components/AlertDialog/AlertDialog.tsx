import React from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import styled from 'styled-components';

type ContentElement = React.ElementRef<typeof AlertDialog.Content>;
interface ContentProps extends React.ComponentPropsWithoutRef<typeof AlertDialog.Content> {
	// className: string;
	children: React.ReactNode;
	title: string;
	description: string;
}

export var AlertDialogContent = React.forwardRef<ContentElement, ContentProps>(({ children, title, description, ...props }, forwardedRef) => (
	<AlertDialog.Portal>
		<StyledOverlay />
		<AlertDialog.Content {...props} ref={forwardedRef}>
			<AlertDialog.Title>{title}</AlertDialog.Title>
			<AlertDialog.Description>{description}</AlertDialog.Description>
			{children}
		</AlertDialog.Content>
	</AlertDialog.Portal>
));

AlertDialogContent.displayName = 'AlertDialogContent';

export var AlertDialogRoot = AlertDialog.Root;
export var AlertDialogTrigger = AlertDialog.Trigger;
export var AlertDialogCancel = AlertDialog.Cancel;
export var AlertDialogAction = AlertDialog.Action;

var StyledOverlay = styled(AlertDialog.Overlay)`
	/* position: fixed;
	inset: 0;
	animation: overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);

	@keyframes overlayShow {
		from {
			opacity: 0;
			transform: translate(-50%, -48%) scale(0.96);
		}
		to {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1);
		}
	} */
`;
