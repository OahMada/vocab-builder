'use client';

import * as React from 'react';
import styled from 'styled-components';

var StyledSection = styled.section`
	grid-column: 2/3;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
`;

function Info({ children }: { children: React.ReactNode }) {
	return (
		<StyledSection>
			<h1>Vocab Build</h1>
			<p>Build your vocabulary with ease.</p>
			<div>{children}</div>
		</StyledSection>
	);
}

export default Info;
