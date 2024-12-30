import * as React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import styled from 'styled-components';

export var DropdownRoot = DropdownMenu.Root;
export var DropdownMenuTrigger = DropdownMenu.Trigger;
export var DropdownMenuItem = DropdownMenu.Item;

type ContentElement = React.ElementRef<typeof DropdownMenu.Content>;
interface ContentProps extends React.ComponentPropsWithoutRef<typeof DropdownMenu.Content> {
	children: React.ReactNode;
}

export var DropdownMenuContent = React.forwardRef<ContentElement, ContentProps>(({ children, ...props }, forwardedRef) => {
	return (
		<DropdownMenu.Portal>
			<StyledContent {...props} ref={forwardedRef}>
				{children}
				<DropdownMenu.Arrow />
			</StyledContent>
		</DropdownMenu.Portal>
	);
});

DropdownMenuContent.displayName = 'DropdownMenuContent';

export default DropdownMenuContent;

var StyledContent = styled(DropdownMenu.Content)`
	background-color: white;
	border-radius: 6px;
	padding: 10px;
	box-shadow: 0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2);
`;
