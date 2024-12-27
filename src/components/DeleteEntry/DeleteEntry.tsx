import * as React from 'react';

import { VocabEntry } from '@/types';
import { DeleteVocabEntryReturnType } from '@/actions';
import { useVocabDataProvider } from '@/components/VocabDataProvider';
import { useOptimisticVocabEntriesContext } from '@/components/OptimisticVocabEntriesProvider';
import { useErrorMessageContext } from '@/components/ErrorMessageProvider';

import { AlertDialogCancel, AlertDialogRoot, AlertDialogTrigger, AlertDialogContent } from '@/components/AlertDialog';
import ButtonGroup from '@/components/ButtonGroup';
import Button from '@/components/Button';

function DeleteEntry({
	children,
	handleDeleteEntry,
}: {
	children: React.ReactNode;
	handleDeleteEntry: () => Promise<{ data: VocabEntry } | { errorMessage: string }>;
}) {
	let [open, setOpen] = React.useState(false);
	let [isPending, startTransition] = React.useTransition();
	let provider = useVocabDataProvider();
	let { optimisticModifyState } = useOptimisticVocabEntriesContext();
	let { updateError } = useErrorMessageContext();

	async function clientAction() {
		updateError('');

		let promise: DeleteVocabEntryReturnType;

		startTransition(() => {
			promise = handleDeleteEntry();
		});

		let response = await promise!;
		if ('errorMessage' in response) {
			updateError(response.errorMessage);
			return;
		}
		optimisticModifyState(response.data.id);
		if (provider?.dispatch) {
			provider.dispatch({ type: 'delete', payload: response.data.id });
		}
		setOpen(false);
	}

	return (
		<AlertDialogRoot open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent
				title='Are you sure you want to delete this sentence?'
				description='You will have to add the sentence again if needed later.'
			>
				<ButtonGroup as='form' action={clientAction}>
					<AlertDialogCancel asChild>
						<Button type='button'>Cancel</Button>
					</AlertDialogCancel>
					<Button type='submit'>{isPending ? 'Deleting...' : 'Delete'}</Button>
				</ButtonGroup>
			</AlertDialogContent>
		</AlertDialogRoot>
	);
}

export default DeleteEntry;
