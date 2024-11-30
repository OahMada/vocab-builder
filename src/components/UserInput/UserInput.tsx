import * as React from 'react';
import styled from 'styled-components';

import { USER_INPUT_SENTENCE } from '@/constants';

import { fetchSentenceRecord } from '@/actions';

import { UserInputSchema } from '@/lib/dataValidation';
import useLocalStoragePersist from '@/hooks/useLocalStoragePersist';
import useKeyboard from '@/hooks/useKeyboard';
import { useErrorMessageContext } from '@/components/ErrorMessageProvider';

import ErrorMsg from '@/components/ErrorMsg';

function UserInput({ updateSentence, clearUserInput }: { updateSentence: (text: string) => void; clearUserInput: boolean }) {
	let [userInput, setUserInput] = React.useState<null | string>(null);
	let [isLoading, startTransition] = React.useTransition();
	let isKeyPressed = useKeyboard(['Shift', 'Enter']); // Press shift + enter to submit
	let { updateError } = useErrorMessageContext();

	let updateUserInput = React.useCallback(
		function (text: string) {
			if (clearUserInput) {
				setUserInput('');
			} else {
				setUserInput(text);
			}
		},
		[clearUserInput]
	);

	useLocalStoragePersist<string>({ defaultValue: '', localStorageKey: USER_INPUT_SENTENCE, valueToSave: userInput, stateSetter: updateUserInput });

	let handleSubmit = React.useCallback(
		async function (e?: React.FormEvent<HTMLFormElement>) {
			if (e) {
				e.preventDefault();
			}
			updateError('');

			let result = UserInputSchema.safeParse(userInput);
			if (result.error) {
				let formattedError = result.error.format();
				updateError(formattedError._errors[0]);
			} else {
				// Check the uniqueness of the sentence before submitting.
				// https://medium.com/@mguleryuz3/next-js-14-app-router-server-actions-with-react-usetransition-a-new-era-for-fullstack-2798e58bb793
				let promise: ReturnType<typeof fetchSentenceRecord>;

				startTransition(() => {
					promise = fetchSentenceRecord(result.data);
				});

				let response = await promise!;
				if (response?.errorMessage) {
					updateError(response.errorMessage);
					return;
				}
				updateSentence(result.data);
			}
		},
		[updateError, updateSentence, userInput]
	);

	async function handleGetClipboard() {
		// https://www.sitepoint.com/clipboard-api/
		let content = await navigator.clipboard.readText();
		setUserInput(content);
	}

	React.useEffect(() => {
		if (isKeyPressed) {
			handleSubmit();
		}
	}, [handleSubmit, isKeyPressed]);

	return (
		<>
			<StyledForm onSubmit={handleSubmit}>
				<h1>Enter Sentence: </h1>
				<textarea
					value={userInput ?? ''}
					onChange={(e) => {
						setUserInput(e.target.value);
					}}
					placeholder='You can also press Shift + Enter to submit.'
					required={true}
					rows={3}
					name='user-input' // Browser would complain if this is omitted.
					autoFocus={true}
				/>
				<div className='btns'>
					<button type='button' onClick={handleGetClipboard}>
						Get Clipboard
					</button>
					<button
						type='button'
						onClick={() => {
							setUserInput('');
						}}
					>
						Clear
					</button>
					<button>{isLoading ? 'Submitting' : 'Submit'}</button>
				</div>
			</StyledForm>
			<ErrorMsg />
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
