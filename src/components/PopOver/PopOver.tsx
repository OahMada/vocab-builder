import * as Popover from '@radix-ui/react-popover';
import * as React from 'react';

function PopOver({
	trigger,
	children,
	open,
	onOpenChange,
}: {
	trigger: React.ReactNode;
	children: React.ReactNode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	return (
		<Popover.Root open={open} onOpenChange={onOpenChange}>
			<Popover.Trigger asChild>{trigger}</Popover.Trigger>
			<Popover.Portal>
				<Popover.Content sideOffset={5} side='top'>
					{children}
					<Popover.Arrow />
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	);
}

export default PopOver;
