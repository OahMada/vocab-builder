'use client';
import * as React from 'react';

import { DialogContent, DialogRoot, DialogTrigger } from '@/components/Dialog';
import { useErrorMessageContext } from '@/components/ErrorMessageProvider';
import { getErrorMessageFromError } from '@/helpers';

function EditUserInfo({
	children,
	fieldSet,
	title,
	submitHandler,
}: {
	children: React.ReactNode;
	fieldSet: React.ReactNode;
	title: string;
	submitHandler: (e: React.SyntheticEvent) => Promise<void>;
}) {
	let [open, setOpen] = React.useState<boolean>(false);
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
		setOpen(false);
	}

	return (
		<DialogRoot open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent title={title} aria-describedby={undefined}>
				<form onSubmit={handleSubmit}>
					{fieldSet}
					<button>{isPending ? 'Updating...' : 'Update'}</button>
				</form>
			</DialogContent>
		</DialogRoot>
	);
}

export default EditUserInfo;
