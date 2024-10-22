import * as React from 'react';

var Translation = function ({ alterTranslation, translation }: { alterTranslation: (text: string) => void; translation: string }) {
	let [editMode, setEditMode] = React.useState(false);

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
					<button type='button' onClick={() => setEditMode(false)}>
						Done
					</button>
				</>
			) : (
				<>
					<p>{translation}</p>
					<button onClick={() => setEditMode(true)}>Edit Translation</button>
				</>
			)}
		</div>
	);
};

export default Translation;
