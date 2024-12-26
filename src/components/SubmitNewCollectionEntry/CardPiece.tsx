'use client';
import styled from 'styled-components';

import ButtonGroup from '@/components/ButtonGroup';

var CardPiece = styled.div`
	display: flex;
	flex-direction: column;
	gap: var(--gap-small);

	position: relative;
	border: 1px solid;
	padding: var(--padding-normal);
	border-radius: var(--border-radius-normal);

	& > p {
		padding: calc(var(--padding-small) + 1px);
		max-width: 100%;
		min-height: calc(2rem * 1.5 + 2 * var(--padding-small) + 2px); // to be the same height as textarea
		background-color: #eee;
		border-radius: var(--border-radius-normal);
	}

	${ButtonGroup} {
		position: absolute;
		right: var(--padding-normal);
		top: var(--padding-normal);
	}
`;

export default CardPiece;
