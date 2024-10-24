import * as React from 'react';

import useLocalStoragePersist from '@/hooks/useLocalStoragePersist';

var Translation = function ({
	setTranslation,
	translation,
}: {
	setTranslation: React.Dispatch<React.SetStateAction<string | null>>;
	translation: string;
}) {
	let [editMode, setEditMode] = React.useState<boolean | null>(null);

	useLocalStoragePersist<boolean>({
		defaultValue: false,
		localStorageKey: 'translation-edit-mode',
		stateSetter: setEditMode,
		valueToSave: editMode,
	});

	return (
		<div>
			{editMode ? (
				<>
					<textarea
						value={translation}
						onChange={(e) => {
							setTranslation(e.target.value);
						}}
						name='translation-text'
					/>
					<button
						type='button'
						onClick={() => {
							setEditMode(false);
						}}
					>
						Done
					</button>
				</>
			) : (
				<>
					<p>{translation}</p>
					<button
						onClick={() => {
							setEditMode(true);
						}}
					>
						Edit Translation
					</button>
				</>
			)}
		</div>
	);
};

export default Translation;
