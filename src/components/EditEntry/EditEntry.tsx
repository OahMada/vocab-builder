import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';

function EditEntry({ children, input }: { children: React.ReactNode; input: React.ReactNode }) {
	return (
		<Dialog.Root>
			<Dialog.Trigger asChild>{children}</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay />
				<Dialog.Content>
					<Dialog.Title>Edit Vocab Entry</Dialog.Title>
					<Dialog.Description>You can only update the translation and note of an entry.</Dialog.Description>
					{input}
					<Dialog.Close asChild>
						<button>Save</button>
					</Dialog.Close>
					<Dialog.Close asChild>
						<button aria-label='Close'>X</button>
					</Dialog.Close>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

export default EditEntry;

// TODO wire up functionality; useOptimistic? probably no.
