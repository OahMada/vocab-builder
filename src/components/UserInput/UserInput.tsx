'use client';

import * as React from 'react';

var localStorageKey = 'user-input-sentence';

function UserInput({ updateSentence }: { updateSentence: (text: string) => void }) {
	let [userInput, setUserInput] = React.useState<null | string>(null);

	React.useEffect(() => {
		let savedValue = window.localStorage.getItem(localStorageKey);
		setUserInput(savedValue ? savedValue : '');
	}, []);

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		// TODO shift + enter to submit
		e.preventDefault();

		if (!userInput) {
			return;
		}

		window.localStorage.setItem(localStorageKey, '');
		setUserInput('');
		updateSentence(userInput);
	}

	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor='user-input-field'>Enter Sentence: </label>
			<textarea
				id='user-input-field'
				value={userInput ?? ''}
				onChange={(e) => {
					setUserInput(e.target.value);
					window.localStorage.setItem(localStorageKey, e.target.value);
				}}
				placeholder='Input the sentence here...'
				required={true}
			/>
			<button>Submit</button>
		</form>
	);
}

export default UserInput;
