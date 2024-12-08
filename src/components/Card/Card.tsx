import styled from 'styled-components';

var Card = styled.div`
	padding: var(--card-padding);

	display: flex;
	flex-direction: column;
	gap: var(--gap-small);

	border-radius: var(--border-radius-big);
	background-color: #eee;
`;

export default Card;
