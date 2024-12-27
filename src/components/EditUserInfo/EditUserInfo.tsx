'use client';
import * as React from 'react';

import { DialogContent, DialogRoot, DialogTrigger } from '@/components/Dialog';
import { useErrorMessageContext } from '@/components/ErrorMessageProvider';
import { getErrorMessageFromError } from '@/helpers';
import StyledForm from '@/components/StyledForm';
import Button from '@/components/Button';

function EditUserInfo({
	children,
	fieldSet,
	title,
	submitHandler,
	dialogOpen,
	updateDialogState,
}: {
	children: React.ReactNode;
	fieldSet: React.ReactNode;
	title: string;
	submitHandler: (e: React.SyntheticEvent) => Promise<void>;
	dialogOpen: boolean;
	updateDialogState: (value: boolean) => void;
}) {
	let [isPending, startTransition] = React.useTransition();
	let { updateError } = useErrorMessageContext();

	async function handleSubmit(e: React.SyntheticEvent) {
		updateError('');

		try {
			let promise: Promise<void>;
			startTransition(() => {
				promise = submitHandler(e);
			});
			await promise!;
		} catch (error) {
			let errorMessage = getErrorMessageFromError(error);
			updateError(errorMessage);
			return;
		}
	}

	return (
		<DialogRoot open={dialogOpen} onOpenChange={updateDialogState}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent title={title} aria-describedby={undefined}>
				<StyledForm onSubmit={handleSubmit}>
					{fieldSet}
					<Button>{isPending ? 'Updating...' : 'Update'}</Button>
				</StyledForm>
			</DialogContent>
		</DialogRoot>
	);
}

export default EditUserInfo;
