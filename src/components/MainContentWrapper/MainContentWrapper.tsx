'use client';

import * as React from 'react';
import styled from 'styled-components';

var StyledSection = styled.main`
	display: grid;
	grid-template-columns: 1fr var(--left-column-width) var(--right-column-width) 1fr;
	padding: var(--padding-biggest);
	min-height: 100dvh;
`;

function MainContentWrapper({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <StyledSection>{children}</StyledSection>;
}

export default MainContentWrapper;
