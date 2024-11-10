import * as React from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import styled from 'styled-components';

import { VocabEntry } from '@/types';
import { DeleteVocabEntryReturnType } from '@/actions';
import { useVocabDataProvider } from '@/components/VocabDataProvider';
import { useOptimisticVocabEntriesContext } from '../OptimisticVocabEntriesProvider';
import { useErrorMessageContext } from '../ErrorMessageProvider';

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
		<AlertDialog.Root open={open} onOpenChange={setOpen}>
			<AlertDialog.Trigger asChild>{children}</AlertDialog.Trigger>
			<AlertDialog.Portal>
				<StyledOverlay />
				<AlertDialog.Content>
					<AlertDialog.Title>Are you sure you want to delete this sentence?</AlertDialog.Title>
					<AlertDialog.Description>You will have to add the sentence again later if needed.</AlertDialog.Description>
					<form style={{ display: 'flex', gap: 25, justifyContent: 'flex-end' }} action={clientAction}>
						<AlertDialog.Cancel asChild>
							<button type='button'>Cancel</button>
						</AlertDialog.Cancel>
						<button>{isPending ? 'Deleting' : 'Delete'}</button>
					</form>
				</AlertDialog.Content>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	);
}

var StyledOverlay = styled(AlertDialog.Overlay)`
	/* position: fixed;
	inset: 0;
	animation: overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);

	@keyframes overlayShow {
		from {
			opacity: 0;
			transform: translate(-50%, -48%) scale(0.96);
		}
		to {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1);
		}
	} */
`;

export default DeleteEntry;
