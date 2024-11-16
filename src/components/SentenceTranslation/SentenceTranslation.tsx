import * as React from 'react';

import useLocalStoragePersist from '@/hooks/useLocalStoragePersist';

interface SentenceTranslationProps {
	updateTranslation: (translation: string) => void;
	translation: string;
}

var SentenceTranslation = React.forwardRef<HTMLTextAreaElement, SentenceTranslationProps>(function (
	{ updateTranslation, translation },
	forwardedRef
) {
	let [editMode, setEditMode] = React.useState<boolean | null>(null);
	useLocalStoragePersist<boolean>({
		defaultValue: false,
		localStorageKey: 'translation-edit-mode',
		stateSetter: React.useCallback((value: boolean) => setEditMode(value), []),
		valueToSave: editMode,
	});

	return (
		<div>
			{editMode ? (
				<>
					<textarea
						value={translation}
						onChange={(e) => {
							updateTranslation(e.target.value);
						}}
						name='translation-text'
						ref={forwardedRef}
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
});

SentenceTranslation.displayName = 'SentenceTranslation';

export default SentenceTranslation;
