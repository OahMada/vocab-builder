import * as React from 'react';
import * as ScrollAble from '@radix-ui/react-scroll-area';

function ScrollArea({ children }: { children: React.ReactNode }) {
	return (
		<ScrollAble.Root>
			<ScrollAble.Viewport>{children}</ScrollAble.Viewport>
			<ScrollAble.Scrollbar orientation='vertical'>
				<ScrollAble.Thumb />
			</ScrollAble.Scrollbar>
		</ScrollAble.Root>
	);
}

export default ScrollArea;
