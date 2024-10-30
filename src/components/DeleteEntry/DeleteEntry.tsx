import * as React from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import styled from 'styled-components';

function DeleteEntry({ children, handleDeleteEntry }: { children: React.ReactNode; handleDeleteEntry: () => Promise<void> }) {
	return (
		<AlertDialog.Root>
			<AlertDialog.Trigger asChild>{children}</AlertDialog.Trigger>
			<AlertDialog.Portal>
				<StyledOverlay />
				<AlertDialog.Content>
					<AlertDialog.Title>Are you sure you want to delete this sentence?</AlertDialog.Title>
					<AlertDialog.Description>You will have to add the sentence again later if needed.</AlertDialog.Description>
					<div style={{ display: 'flex', gap: 25, justifyContent: 'flex-end' }}>
						<AlertDialog.Cancel asChild>
							<button>Cancel</button>
						</AlertDialog.Cancel>
						<AlertDialog.Action asChild>
							<button onClick={handleDeleteEntry}>Delete</button>
						</AlertDialog.Action>
					</div>
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
