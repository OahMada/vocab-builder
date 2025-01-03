'use client';

import * as React from 'react';
import { saveAs } from 'file-saver';

import { exportData, type ExportDataReturnType } from '@/actions';
import { useErrorMessageContext } from '@/components/ErrorMessageProvider';
import Button from '@/components/Button';

function ExportData() {
	let [isPending, startTransition] = React.useTransition();
	let { updateError } = useErrorMessageContext();
	async function clientAction() {
		updateError('');
		let promise: ExportDataReturnType;
		startTransition(() => {
			promise = exportData();
		});
		let response = await promise!;
		if ('errorMessage' in response) {
			updateError(response.errorMessage);
			return;
		}

		let blob = new Blob([response.data], { type: 'text/plain;charset=utf-8' });
		saveAs(blob, 'exported-vocab.txt');
	}
	return <Button onClick={clientAction}>{isPending ? 'Processing...' : 'Export'}</Button>;
}

export default ExportData;
