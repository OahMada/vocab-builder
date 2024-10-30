import * as React from 'react';

import useLocalStoragePersist from '@/hooks/useLocalStoragePersist';
import { NOTE_EDIT_MODE } from '@/constants';

function Note({ note, updateNote }: { note: string; updateNote: (note: string) => void }) {
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
}

export default Note;
