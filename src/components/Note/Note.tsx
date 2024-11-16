import * as React from 'react';

import useLocalStoragePersist from '@/hooks/useLocalStoragePersist';
import { NOTE_EDIT_MODE } from '@/constants';

interface NoteProps {
	note: string;
	updateNote: (note: string) => void;
}

var Note = React.forwardRef<HTMLTextAreaElement, NoteProps>(function ({ note, updateNote }, forwardedRef) {
	let [editMode, setEditMode] = React.useState<boolean | null>(null);
	useLocalStoragePersist<boolean>({
		defaultValue: false,
		localStorageKey: NOTE_EDIT_MODE,
		stateSetter: React.useCallback((value: boolean) => setEditMode(value), []),
		valueToSave: editMode,
	});
	return (
		<div>
			{editMode ? (
				<>
					<textarea
						name='note'
						value={note}
						onChange={(e) => {
							updateNote(e.target.value);
						}}
						ref={forwardedRef}
					/>
					<button onClick={() => setEditMode(false)}>Done</button>
				</>
			) : (
				<>
					<p>{note ? note : 'Empty Note.'}</p>
					<button onClick={() => setEditMode(true)}>Edit Note</button>
				</>
			)}
		</div>
	);
});

Note.displayName = 'Note';

export default Note;
