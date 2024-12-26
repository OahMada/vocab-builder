'use client';

import * as React from 'react';

import { useErrorMessageContext } from '@/components/ErrorMessageProvider';
import { Toast } from '@/components/Toast';

export function ErrorMsg() {
	let { errorMsg } = useErrorMessageContext();

	return errorMsg ? <Toast toastType='error' content={errorMsg} /> : null;
}

export default ErrorMsg;
