'use client';

import * as React from 'react';
import styled from 'styled-components';

import { UpdateVocabEntryReturnType } from '@/actions';
import { RawFormData } from '@/types';
import { useVocabDataProvider } from '@/components/VocabDataProvider';
import { useOptimisticVocabEntriesContext } from '@/components/OptimisticVocabEntriesProvider';
import { useErrorMessageContext } from '@/components/ErrorMessageProvider';

import { DialogContent, DialogRoot, DialogTrigger } from '@/components/Dialog';
import Button from '@/components/Button';
import ButtonGroup from '@/components/ButtonGroup';

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
			<DialogContent title='Edit Vocab Entry' description='You can update the translation and note of an entry.'>
				<StyledForm action={clientAction}>
					{fieldSet}
					<ButtonGroup>
						<Button type='submit'>{isPending ? 'Saving...' : 'Save'}</Button>
					</ButtonGroup>
				</StyledForm>
			</DialogContent>
		</DialogRoot>
	);
}

export default EditEntry;

var StyledForm = styled.form`
	display: flex;
	flex-direction: column;
	gap: var(--gap-small);

	label {
		font-weight: bold;
	}
`;
