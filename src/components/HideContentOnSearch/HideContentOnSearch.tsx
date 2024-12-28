'use client';

import styled from 'styled-components';

let StyledDiv = styled.div<{ $shouldHide: boolean }>`
	display: ${({ $shouldHide }) => ($shouldHide ? 'none' : 'block')};
`;

export default StyledDiv;
