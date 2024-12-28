'use client';

import styled from 'styled-components';

var InputEntry = styled.div`
	display: flex;
	flex-direction: row;
	gap: var(--gap-small);
	align-items: center;

	label {
		flex-basis: 6rem;
		min-width: fit-content;
		flex-shrink: 0;
	}
`;

export default InputEntry;
