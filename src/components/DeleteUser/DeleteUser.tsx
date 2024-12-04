'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { deleteUser, type DeleteUserReturnType } from '@/actions';
import { useErrorMessageContext } from '@/components/ErrorMessageProvider';
import { AlertDialogCancel, AlertDialogRoot, AlertDialogTrigger, AlertDialogContent } from '@/components/AlertDialog';

function DeleteUser({ children }: { children: React.ReactNode }) {
	let { updateError } = useErrorMessageContext();
	let [isPending, startTransition] = React.useTransition();
	let [open, setOpen] = React.useState(false);

	let router = useRouter();

	async function clientAction() {
		let promise: DeleteUserReturnType;

		startTransition(() => {
			promise = deleteUser();
		});

		let response = await promise!;
		if (response) {
			updateError(response.errorMessage);
			return;
		}
		setOpen(false);
		router.push('/');
	}

	return (
		<AlertDialogRoot open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent title='Are you sure you want to delete your account and all data?' description='The action can not be reverted.'>
				<form style={{ display: 'flex', gap: 25, justifyContent: 'flex-end' }} action={clientAction}>
					<AlertDialogCancel asChild>
						<button type='button'>Cancel</button>
					</AlertDialogCancel>
					<button>{isPending ? 'Loading' : 'Delete'}</button>
				</form>
			</AlertDialogContent>
		</AlertDialogRoot>
	);
}

export default DeleteUser;
