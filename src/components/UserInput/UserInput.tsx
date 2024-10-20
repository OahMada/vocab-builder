import * as React from 'react';
import styled from 'styled-components';

import { USER_INPUT_SENTENCE, SENTENCE_SAMPLE } from '@/constants';
import Toast from '@/components/Toast';
import { UserInputSchema } from '@/lib/dataValidation';
import { fetchSentenceRecord } from '@/actions';

function UserInput({ updateSentence, clearUserInput }: { updateSentence: (text: string) => void; clearUserInput: boolean }) {
	let [userInput, setUserInput] = React.useState<null | string>(null);
	let [error, setError] = React.useState('');
	let [isLoading, startTransition] = React.useTransition();

	React.useEffect(() => {
		let savedValue = window.localStorage.getItem(USER_INPUT_SENTENCE);
		if (clearUserInput) {
			setUserInput('');
			window.localStorage.setItem(USER_INPUT_SENTENCE, '');
		} else {
			setUserInput(savedValue);
		}
	}, [clearUserInput]);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		// TODO shift + enter to submit
		e.preventDefault();

		let result = UserInputSchema.safeParse(userInput);
		if (result.error) {
			let formattedError = result.error.format();
			setError(formattedError._errors[0]);
		} else {
			// Check the uniqueness of the sentence before submitting.
			// https://medium.com/@mguleryuz3/next-js-14-app-router-server-actions-with-react-usetransition-a-new-era-for-fullstack-2798e58bb793
			let promise: ReturnType<typeof fetchSentenceRecord>;

			startTransition(() => {
				promise = fetchSentenceRecord(result.data);
			});
			let response = await promise!;
			if (response?.errorMessage) {
				setError(response.errorMessage);
				return;
			}

			setError('');
			updateSentence(result.data);
		}
	}

	return (
		<>
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
					<button>{isLoading ? 'Submitting' : 'Submit'}</button>
				</div>
			</StyledForm>
			{error && <Toast toastType='error' content={error} />}
		</>
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
