'use client';

import * as React from 'react';

import { UpdateVocabEntryReturnType } from '@/actions';
import { RawFormData } from '@/types';
import { useVocabDataProvider } from '@/components/VocabDataProvider';
import { useOptimisticVocabEntriesContext } from '@/components/OptimisticVocabEntriesProvider';
import { useErrorMessageContext } from '@/components/ErrorMessageProvider';

import { DialogContent, DialogRoot, DialogTrigger } from '@/components/Dialog';

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
		<DialogRoot open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent title='Edit Vocab Entry' description='You can only update the translation and note of an entry.'>
				<form action={clientAction}>
					{fieldSet}
					<button>{isPending ? 'Saving...' : 'Save'}</button>
				</form>
			</DialogContent>
		</DialogRoot>
	);
}

export default EditEntry;
