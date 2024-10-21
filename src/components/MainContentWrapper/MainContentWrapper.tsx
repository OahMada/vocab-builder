'use client';

import * as React from 'react';
import styled from 'styled-components';

var StyledSection = styled.main`
	display: grid;
	grid-template-columns: 1fr 21.875rem 42.875rem 1fr;
	padding: 32px;
`;

function MainContentWrapper({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <StyledSection>{children}</StyledSection>;
}

export default MainContentWrapper;
