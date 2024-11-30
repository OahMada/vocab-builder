'use client';

import * as React from 'react';

import { useErrorMessageContext } from '@/components/ErrorMessageProvider';
import Toast from '@/components/Toast';

export function ErrorMsg() {
	let { errorMsg } = useErrorMessageContext();

	return errorMsg ? (
		<React.Suspense fallback='loading'>
			<Toast toastType='error' content={errorMsg} />
		</React.Suspense>
	) : null;
}

export default ErrorMsg;
