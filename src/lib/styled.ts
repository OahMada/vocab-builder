import { css } from 'styled-components';

export var H3Styles = css`
	font-size: var(--font-big);
	line-height: var(--header-height);
`;

export var DialogOverlayStyles = css`
	position: fixed;
	inset: 0;
	background-color: gray;
	opacity: 0.9;
`;

export var DialogContentStyles = css`
	background-color: white;

	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);

	width: 40vw;
	padding: var(--padding-big);
`;

export var DialogDescriptionStyles = css`
	margin-bottom: 10px;
`;
