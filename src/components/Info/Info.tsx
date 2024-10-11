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
	return <StyledSection>{children}</StyledSection>;
}

export default Info;
