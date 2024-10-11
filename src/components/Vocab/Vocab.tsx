'use client';

import * as React from 'react';
import styled from 'styled-components';

var StyledArticle = styled.article`
	grid-column: 3 / 4;
	display: flex;
	flex-direction: column;
	gap: 32px;
`;

function Vocab({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <StyledArticle>{children}</StyledArticle>;
}

export default Vocab;
