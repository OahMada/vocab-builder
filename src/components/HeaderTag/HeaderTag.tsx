import * as React from 'react';
import styled, { css } from 'styled-components';

function HeaderTag({ children, level }: { children: React.ReactNode; level: number }) {
	let tagName = `h${level}`;
	return (
		<StyledTag as={tagName} $level={level}>
			{children}
		</StyledTag>
	);
}

export default HeaderTag;

var StyledTag = styled.h1<{ $level: number }>`
	${({ $level }) => {
		switch ($level) {
			case 2:
				return css`
					font-size: var(--font-bigger);
					line-height: var(--header-height);
				`;
			case 3:
				return H3Styles;
			case 1:
				return css`
					font-size: var(--font-biggest);
					line-height: 1;
				`;
		}
	}}
`;

export var H3Styles = css`
	font-size: var(--font-big);
	line-height: var(--header-height);
`;
