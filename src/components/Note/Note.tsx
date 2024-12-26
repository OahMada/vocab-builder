import * as React from 'react';

import useLocalStoragePersist from '@/hooks/useLocalStoragePersist';
import { NOTE_EDIT_MODE } from '@/constants';
import Button from '@/components/Button';
import ButtonGroup from '@/components/ButtonGroup';
import TextArea from '@/components/TextArea';

interface NoteProps {
	note: string;
	updateNote: (note: string) => void;
}

var Note = React.forwardRef<HTMLTextAreaElement, NoteProps>(function Note({ note, updateNote }, forwardedRef) {
	let [editMode, setEditMode] = React.useState<boolean | null>(null);
	useLocalStoragePersist<boolean>({
		defaultValue: false,
		localStorageKey: NOTE_EDIT_MODE,
		stateSetter: React.useCallback((value: boolean) => setEditMode(value), []),
		valueToSave: editMode,
	});
	return (
		<>
			{editMode ? (
				<>
					<TextArea
						name='note'
						value={note}
						onChange={(e) => {
							updateNote(e.target.value);
						}}
						ref={forwardedRef}
						placeholder="Don't overwhelm yourself with overly extensive notes."
					/>
					<ButtonGroup>
						<Button onClick={() => updateNote('')}>Clear</Button>
						<Button onClick={() => setEditMode(false)}>Done</Button>
					</ButtonGroup>
				</>
			) : (
				<>
					{note && <p>{note}</p>}
					<ButtonGroup>
						<Button onClick={() => setEditMode(true)}>Edit Note</Button>
					</ButtonGroup>
				</>
			)}
		</>
	);
});

export default Note;
