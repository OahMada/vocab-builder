import * as React from 'react';

import useLocalStoragePersist from '@/hooks/useLocalStoragePersist';

function Note({ note, setNote }: { note: string; setNote: React.Dispatch<React.SetStateAction<string | null>> }) {
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
							setNote(e.target.value);
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
