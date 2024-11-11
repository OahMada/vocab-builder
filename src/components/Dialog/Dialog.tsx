import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';

type ContentElement = React.ElementRef<typeof Dialog.Content>;
interface ContentProps extends React.ComponentPropsWithoutRef<typeof Dialog.Content> {
	// className: string;
	children: React.ReactNode;
	title: string;
	description: string;
}

export var DialogContent = React.forwardRef<ContentElement, ContentProps>(({ children, title, description, ...props }, forwardedRef) => (
	<Dialog.Portal>
		<Dialog.Overlay />
		<Dialog.Content {...props} ref={forwardedRef}>
			<Dialog.Title>{title}</Dialog.Title>
			<Dialog.Description>{description}</Dialog.Description>
			{children}
			<Dialog.Close asChild>
				<button aria-label='Close'>X</button>
			</Dialog.Close>
		</Dialog.Content>
	</Dialog.Portal>
));

DialogContent.displayName = 'DialogContent';

export var DialogRoot = Dialog.Root;
export var DialogTrigger = Dialog.Trigger;
