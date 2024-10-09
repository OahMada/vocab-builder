'use client';

import * as React from 'react';

var localStorageKey = 'user-input-sentence';

function UserInput() {
	let [sentence, setSentence] = React.useState<null | string>(null);

	React.useEffect(() => {
		let savedValue = window.localStorage.getItem(localStorageKey);
		setSentence(savedValue ? savedValue : '');
	}, []);

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		// TODO shift + enter to submit
		e.preventDefault();
		window.localStorage.setItem(localStorageKey, '');
		setSentence('');
	}

	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor='user-input-field'>Enter Sentence: </label>
			<textarea
				id='user-input-field'
				value={sentence ?? ''}
				onChange={(e) => {
					setSentence(e.target.value);
					window.localStorage.setItem(localStorageKey, e.target.value);
				}}
				placeholder='Input the sentence here...'
			/>
			<button>Submit</button>
		</form>
	);
}

export default UserInput;
