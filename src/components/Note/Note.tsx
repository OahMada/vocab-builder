import * as React from 'react';

import useLocalStoragePersist from '@/hooks/useLocalStoragePersist';

function Note({ note, updateNote }: { note: string; updateNote: (note: string) => void }) {
	let [editMode, setEditMode] = React.useState<boolean | null>(null);
	useLocalStoragePersist<boolean>({
		defaultValue: false,
		localStorageKey: 'note-edit-mode',
		stateSetter: setEditMode,
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
