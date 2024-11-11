'use client';

import * as Popover from '@radix-ui/react-popover';
import * as React from 'react';

type ContentElement = React.ElementRef<typeof Popover.Content>;
interface ContentProps extends React.ComponentPropsWithoutRef<typeof Popover.Content> {
	// className: string;
	children: React.ReactNode;
}

export var PopoverRoot = Popover.Root;
export var PopoverTrigger = Popover.Trigger;

export var PopoverContent = React.forwardRef<ContentElement, ContentProps>(({ children, ...props }, forwardedRef) => (
	<Popover.Portal>
		<Popover.Content sideOffset={5} {...props} ref={forwardedRef} side='top'>
			{children}
			<Popover.Arrow />
		</Popover.Content>
	</Popover.Portal>
));

PopoverContent.displayName = 'PopoverContent';
