'use client';
import styled from 'styled-components';

var StyledDiv = styled.div`
	display: flex;
	flex-direction: column;
	gap: var(--gap-big);
	margin-left: 9rem;
	height: calc(100dvh - var(--footer-height) - var(--header-height) - var(--padding-biggest) * 2);

	@media (width <= 66.5rem) {
		grid-column: 2 / 3;
		margin: 0 auto;
		padding-top: 10rem;
	}
`;

export default StyledDiv;
