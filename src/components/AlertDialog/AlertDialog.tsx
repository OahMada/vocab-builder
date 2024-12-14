import React from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import styled from 'styled-components';

import { DialogOverlayStyles, DialogContentStyles, H3Styles, DialogDescriptionStyles } from '@/lib/styled';

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
		<StyledContent {...props} ref={forwardedRef}>
			<StyledTitle>{title}</StyledTitle>
			<StyledDescription>{description}</StyledDescription>
			{children}
		</StyledContent>
	</AlertDialog.Portal>
));

AlertDialogContent.displayName = 'AlertDialogContent';

export var AlertDialogRoot = AlertDialog.Root;
export var AlertDialogTrigger = AlertDialog.Trigger;
export var AlertDialogCancel = AlertDialog.Cancel;
export var AlertDialogAction = AlertDialog.Action;

var StyledOverlay = styled(AlertDialog.Overlay)`
	${DialogOverlayStyles}
`;

var StyledContent = styled(AlertDialog.Content)`
	${DialogContentStyles}
`;

var StyledTitle = styled(AlertDialog.Title)`
	${H3Styles}
`;

var StyledDescription = styled(AlertDialog.Description)`
	${DialogDescriptionStyles}
`;
