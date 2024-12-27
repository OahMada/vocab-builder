'use client';

import styled from 'styled-components';

var InputEntry = styled.div`
	display: flex;
	flex-direction: row;
	gap: var(--gap-small);
	width: 100%;
	align-items: center;

	label {
		flex-basis: 6rem;
		min-width: fit-content;
	}
`;

export default InputEntry;
