'use client';

import * as React from 'react';
import styled from 'styled-components';

var StyledSection = styled.main`
	display: grid;
	grid-template-columns: 1fr var(--left-column-width) var(--right-column-width) 1fr;
	padding: var(--padding-biggest);
	min-height: 100dvh;
	width: 100%;

	@media (width <= 66.5rem) {
		grid-template-columns: 1fr min(var(--right-column-width), calc(100% - var(--padding-biggest) * 2)) 1fr;
		padding: var(--padding-big) 0;
	}
`;

function MainContentWrapper({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <StyledSection>{children}</StyledSection>;
}

export default MainContentWrapper;
