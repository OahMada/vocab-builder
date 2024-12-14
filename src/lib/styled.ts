import { css } from 'styled-components';

export var h3Styles = css`
	font-size: var(--font-big);
	line-height: var(--header-height);
`;

export var dialogOverlayStyles = css`
	position: fixed;
	inset: 0;
	background-color: gray;
	opacity: 0.9;
`;

export var dialogContentStyles = css`
	background-color: white;

	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);

	width: 40vw;
	padding: var(--padding-big);
`;

export var dialogDescriptionStyles = css`
	margin-bottom: 10px;
`;

export var closeIconStyles = css`
	border: none;
	background-color: unset;

	position: absolute;
	top: var(--padding-big);
	right: var(--padding-big);
`;
