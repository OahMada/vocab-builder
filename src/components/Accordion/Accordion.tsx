'use client';

import * as Accordion from '@radix-ui/react-accordion';
import * as React from 'react';
import styled from 'styled-components';
import { ChevronDown } from 'react-feather';

type TriggerElement = React.ElementRef<typeof Accordion.Trigger>;
interface TriggerProps extends React.ComponentPropsWithoutRef<typeof Accordion.Trigger> {
	// className: string;
	children: React.ReactNode;
}

type ContentElement = React.ElementRef<typeof Accordion.Content>;
interface ContentProps extends React.ComponentPropsWithoutRef<typeof Accordion.Content> {
	// className: string;
	children: React.ReactNode;
}

export var AccordionTrigger = React.forwardRef<TriggerElement, TriggerProps>(({ children, ...props }, forwardedRef) => (
	<StyledHeader>
		<StyledTrigger {...props} ref={forwardedRef}>
			<div>
				<p>{children}</p>
				<ChevronDown aria-hidden={true} />
			</div>
		</StyledTrigger>
	</StyledHeader>
));
AccordionTrigger.displayName = 'AccordionTrigger';

export var AccordionContent = React.forwardRef<ContentElement, ContentProps>(({ children, ...props }, forwardedRef) => (
	<StyledContent {...props} ref={forwardedRef}>
		{children}
	</StyledContent>
));

AccordionContent.displayName = 'AccordionContent';

export var AccordionRoot = styled(Accordion.Root)`
	border: 1px solid;
	border-radius: var(--border-radius-big);
`;

export var AccordionItem = styled(Accordion.Item)`
	&:not(:last-child) {
		border-bottom: 1px solid;
	}
`;

var StyledHeader = styled(Accordion.Header)`
	padding: var(--card-padding);

	&[data-state='open'] {
		border-bottom: 1px solid;
	}
`;

var StyledTrigger = styled(Accordion.Trigger)`
	cursor: pointer;
	font-size: var(--font-big);
	display: flex;
	justify-content: space-between;
	align-items: center;

	&[data-state='open'] svg {
		transform: rotate(180deg);
	}

	&:hover {
		color: #666;
	}
`;

var StyledContent = styled(Accordion.Content)`
	display: flex;
	flex-direction: column;
	gap: var(--gap-normal);

	&[data-state='open'] {
		padding: var(--card-padding);
	}
`;
