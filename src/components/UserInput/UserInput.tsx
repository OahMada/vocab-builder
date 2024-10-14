import * as React from 'react';
import styled from 'styled-components';
import { USER_INPUT_SENTENCE, SENTENCE_SAMPLE } from '@/constants';

function UserInput({ updateSentence }: { updateSentence: (text: string) => void }) {
	let [userInput, setUserInput] = React.useState<null | string>(null);

	React.useEffect(() => {
		let savedValue = window.localStorage.getItem(USER_INPUT_SENTENCE);
		setUserInput(savedValue ? savedValue : '');
	}, []);

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		// TODO shift + enter to submit
		e.preventDefault();

		if (!userInput) {
			return;
		}

		setUserInput('');
		window.localStorage.setItem(USER_INPUT_SENTENCE, '');
		updateSentence(userInput);
	}

	return (
		<StyledForm onSubmit={handleSubmit}>
			<h1>Enter Sentence: </h1>
			<textarea
				value={userInput ?? ''}
				onChange={(e) => {
					setUserInput(e.target.value);
					window.localStorage.setItem(USER_INPUT_SENTENCE, e.target.value);
				}}
				placeholder='Input the sentence here...'
				required={true}
				rows={3}
			/>
			<div className='btns'>
				<button
					type='button'
					onClick={() => {
						setUserInput(SENTENCE_SAMPLE);
						window.localStorage.setItem(USER_INPUT_SENTENCE, SENTENCE_SAMPLE);
					}}
				>
					Sample
				</button>
				<button>Submit</button>
			</div>
		</StyledForm>
	);
}

export default UserInput;

var StyledForm = styled.form`
	display: flex;
	flex-direction: column;
	gap: 8px;

	textarea {
		resize: none;
		width: 100%;
	}

	.btns {
		display: flex;
		justify-content: flex-end;
	}
`;
