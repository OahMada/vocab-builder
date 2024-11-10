'use client';

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';

import { UpdateVocabEntryReturnType } from '@/actions';
import { RawFormData } from '@/types';
import { useVocabDataProvider } from '@/components/VocabDataProvider';
import { useOptimisticVocabEntriesContext } from '../OptimisticVocabEntriesProvider';
import { useErrorMessageContext } from '../ErrorMessageProvider';

function EditEntry({
	children,
	fieldSet,
	handleEditEntry,
}: {
	children: React.ReactNode;
	fieldSet: React.ReactNode;
	handleEditEntry: (formData: RawFormData) => UpdateVocabEntryReturnType;
}) {
	let [open, setOpen] = React.useState<boolean>(false);
	let [isPending, startTransition] = React.useTransition();
	let provider = useVocabDataProvider();
	let { optimisticModifyState } = useOptimisticVocabEntriesContext();
	let { updateError } = useErrorMessageContext();

	async function clientAction(formData: FormData) {
		updateError('');

		let rawFormData = {
			translation: formData.get('translation'),
			note: formData.get('note'),
		};

		let promise: UpdateVocabEntryReturnType;
		startTransition(() => {
			promise = handleEditEntry(rawFormData);
		});

		let response = await promise!;
		if ('errorMessage' in response) {
			updateError(response.errorMessage);
			return;
		}
		optimisticModifyState({ id: response.data.id, translation: response.data.translation, note: response.data.note });
		if (provider?.dispatch) {
			provider.dispatch({ type: 'update', payload: response.data });
		}
		setOpen(false);
	}

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger asChild>{children}</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay />
				<Dialog.Content>
					<Dialog.Title>Edit Vocab Entry</Dialog.Title>
					<Dialog.Description>You can only update the translation and note of an entry.</Dialog.Description>
					<form action={clientAction}>
						{fieldSet}
						<button>{isPending ? 'Saving...' : 'Save'}</button>
					</form>
					<Dialog.Close asChild>
						<button aria-label='Close'>X</button>
					</Dialog.Close>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

export default EditEntry;
