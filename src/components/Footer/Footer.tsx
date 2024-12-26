'use client';

import * as React from 'react';
import styled from 'styled-components';

var StyledFooter = styled.footer`
	font-size: var(--font-small);
	grid-column: 2 / 4;
	display: flex;
	justify-content: center;
	height: var(--footer-height);
`;

function Footer() {
	return <StyledFooter> &copy;&nbsp;2018-present Adam Hao. All rights reserved.</StyledFooter>;
}

export default Footer;
