'use client';

import * as React from 'react';
import styled from 'styled-components';

var StyledArticle = styled.article`
	grid-column: 3 / 4;

	@media (width <= 66.5rem) {
		grid-column: 2 / 3;
	}

	display: flex;
	flex-direction: column;
	gap: var(--gap-big);

	min-height: calc(100dvh - 2 * var(--padding-biggest) - var(--footer-height));

	@media (width <= 66.5rem) {
		min-height: calc(100dvh - 2 * var(--padding-biggest) - var(--footer-height) - var(--header-height));
	}
`;

export default function StyledArticleWrapper({ children }: { children: React.ReactNode }) {
	return <StyledArticle>{children}</StyledArticle>;
}
