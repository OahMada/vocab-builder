'use client';

import styled from 'styled-components';

var StyledDiv = styled.div`
	display: none;
	grid-column: 2 / 3;
	height: var(--header-height);
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;

	@media (width <= 66.5rem) {
		display: flex;
	}

	.dropdown {
		display: flex;
		gap: var(--gap-extra-small);
		align-items: center;

		span {
			font-size: var(--font-normal);
		}
	}
`;

export default StyledDiv;
