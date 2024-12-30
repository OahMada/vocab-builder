'use client';

import styled from 'styled-components';

var StyledSection = styled.section`
	grid-column: 2/3;
	height: calc(100dvh - 2 * var(--padding-biggest) - var(--footer-height));

	@media (width <= 66.5rem) {
		display: none;
	}

	.wrapper {
		padding: 0 var(--padding-big);
		display: flex;
		flex-direction: column;
		gap: var(--gap-big);
		position: fixed;
		left: calc((100% - var(--left-column-width) - var(--right-column-width)) / 2);
		@media (width <= 68.75rem) {
			left: var(--padding-biggest);
		}

		width: var(--left-column-width);
	}

	.user-info {
		display: flex;
		flex-direction: column;
		gap: var(--gap-big);
		p:not(:last-child) {
			margin-bottom: 10px;
		}
	}
`;

export default StyledSection;
