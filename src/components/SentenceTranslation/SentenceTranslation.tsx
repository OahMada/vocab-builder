import * as React from 'react';

var Translation = function ({ alterTranslation, translation }: { alterTranslation: (text: string) => void; translation: string }) {
	let [editMode, setEditMode] = React.useState<boolean | null>(null);

	React.useEffect(() => {
		let savedValue = window.localStorage.getItem('translation-edit-mode');
		setEditMode(savedValue ? JSON.parse(savedValue) : false); // Strangely I can't use Boolean(savedValue) here
	}, []);

	React.useEffect(() => {
		if (typeof editMode === 'boolean') {
			window.localStorage.setItem('translation-edit-mode', JSON.stringify(editMode));
		}
	}, [editMode]);

	return (
		<div>
			{editMode ? (
				<>
					<textarea
						value={translation}
						onChange={(e) => {
							alterTranslation(e.target.value);
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
