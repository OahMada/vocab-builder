'use client';

import * as React from 'react';
import styled from 'styled-components';

import ErrorMsg from '@/components/ErrorMsg';

function UserInfo({ children }: { children: React.ReactNode }) {
	return (
		<StyledDiv>
			{children}
			<ErrorMsg />
		</StyledDiv>
	);
}

var StyledDiv = styled.div``;

export default UserInfo;
