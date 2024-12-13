'use client';
import styled from 'styled-components';

import ButtonGroup from '@/components/ButtonGroup';

var CardPiece = styled.div`
	display: flex;
	flex-direction: column;
	gap: var(--gap-small);

	position: relative;
	border: 1px solid;
	padding: var(--card-padding);
	border-radius: var(--border-radius-normal);

	p {
		padding: calc(var(--textarea-padding) + 1px);
		max-width: 100%;
		min-height: calc(2rem * 1.5 + 2 * var(--textarea-padding) + 2px); // to be the same height as textarea
		background-color: #eee;
		border-radius: var(--border-radius-normal);
	}

	${ButtonGroup} {
		position: absolute;
		right: var(--card-padding);
		top: var(--card-padding);
	}
`;

export default CardPiece;
