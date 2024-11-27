'use client';

import * as React from 'react';
import styled from 'styled-components';

import { useErrorMessageContext } from '@/components/ErrorMessageProvider';
import Toast from '@/components/Toast';

function AppSetting({ children }: { children: React.ReactNode }) {
	let { errorMsg } = useErrorMessageContext();

	return (
		<StyledDiv>
			{children}
			{errorMsg && (
				<React.Suspense fallback='loading'>
					<Toast toastType='error' content={errorMsg} />
				</React.Suspense>
			)}
		</StyledDiv>
	);
}

var StyledDiv = styled.div``;

export default AppSetting;
