'use client';

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';

import useLocalStoragePersist from '@/hooks/useLocalStoragePersist';
import { ENTRY_EDIT_MODE } from '@/constants';

function EditEntry({
	children,
	fieldSet,
	handleEditEntry,
}: {
	children: React.ReactNode;
	fieldSet: React.ReactNode;
	handleEditEntry: () => Promise<void>;
}) {
	let [open, setOpen] = React.useState<boolean | null>(null);

	useLocalStoragePersist({
		defaultValue: false,
		localStorageKey: ENTRY_EDIT_MODE,
		valueToSave: open,
		stateSetter: React.useCallback((value: boolean) => setOpen(value), []),
	});

	async function clientAction() {
		await handleEditEntry();
		// TODO Need a way to stop closing the popover in the case of an error.
		setOpen(false);
	}

	// TODO make use of useFormData

	return (
		<Dialog.Root open={open ?? false} onOpenChange={setOpen}>
			<Dialog.Trigger asChild>{children}</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay />
				<Dialog.Content>
					<Dialog.Title>Edit Vocab Entry</Dialog.Title>
					<Dialog.Description>You can only update the translation and note of an entry.</Dialog.Description>
					<form action={clientAction}>
						{fieldSet}
						<button>Save</button>
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
