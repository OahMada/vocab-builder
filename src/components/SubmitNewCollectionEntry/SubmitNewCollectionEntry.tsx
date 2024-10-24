import * as React from 'react';
import useSWRImmutable from 'swr/immutable';
import axios from 'axios';
import Cookies from 'js-cookie';
import { startTransition } from 'react';

import { FETCH_TRANSLATE_ROUTE, SENTENCE_TO_BE_PROCESSED, USER_EMAIL, TRANSLATION_TEXT } from '@/constants';
import { createVocabEntry } from '@/actions';
import { CreateVocabEntryInputSchema } from '@/lib/dataValidation';
import Toast from '@/components/Toast';
import { constructZodErrorMessage, getErrorMessage } from '@/helpers';
import SentenceTranslation from '@/components/SentenceTranslation';
import { VocabEntry } from '../Vocab/getVocabList';
import useLocalStoragePersist from '@/hooks/useLocalStoragePersist';

var fetcher = async (url: string, sentence: string): Promise<string> => {
	let response = await axios.post(url, {
		sentence,
	});
	return response.data;
};

function SubmitNewCollectionEntry({
	sentence,
	addOptimisticVocabEntry,
	updateSentence,
	updateShouldClearUserInput,
}: {
	sentence: string;
	addOptimisticVocabEntry: (value: VocabEntry) => void;
	updateSentence: (text: string) => void;
	updateShouldClearUserInput: (value: boolean) => void;
}) {
	let [error, setError] = React.useState('');
	let [translation, setTranslation] = React.useState<null | string>(null);

	let {
		data,
		error: swrError,
		isLoading,
		mutate,
		isValidating,
	} = useSWRImmutable([FETCH_TRANSLATE_ROUTE, sentence], ([url, sentence]) => fetcher(url, sentence), {
		shouldRetryOnError: false,
		onError: (error) => {
			if (process.env.NODE_ENV === 'development') console.log(error);
			let errorMessage = getErrorMessage(error);
			setError(errorMessage);
		},
	});

	let updateTranslation = React.useCallback(
		function (savedText: null | string) {
			if (data && !savedText) {
				setTranslation(data);
			} else if (savedText) {
				// To preserve user editing after a page refresh.
				setTranslation(savedText);
			}
		},
		[data]
	);
	useLocalStoragePersist({ defaultValue: '', localStorageKey: TRANSLATION_TEXT, valueToSave: translation, stateUpdater: updateTranslation });

	let translationNode: React.ReactNode;

	if (isLoading || isValidating) {
		translationNode = <p>Translating...</p>;
	} else if (swrError) {
		translationNode = <p>Error occurred during the process; you can hit the button below to try again.</p>;
	} else if (translation) {
		translationNode = <SentenceTranslation setTranslation={setTranslation} translation={translation} />;
	}

	async function handleSubmitNewEntry() {
		let newEntry = {
			sentence,
			translation,
			// note, // TODO note editing functionality
			userEmail: USER_EMAIL,
		};

		let result = CreateVocabEntryInputSchema.safeParse(newEntry);
		if (result.error) {
			let errorMessage = constructZodErrorMessage(result.error);
			setError(errorMessage);
			return;
		} else {
			let data = result.data;
			startTransition(() => {
				// If not wrapped in startTransition, there would be an error: An optimistic state update occurred outside a transition or action. To fix, move the update to an action, or wrap with startTransition.
				addOptimisticVocabEntry({
					id: 'optimistic_entry',
					note: data.note ?? '',
					sentence: data.sentence,
					translation: data.translation,
				});
			});

			// Put the resetting logic before the create action to get a snappy UI.
			resetUserInput();
			updateShouldClearUserInput(true);
			resetTranslationText();
			let response = await createVocabEntry.bind(null, data)();
			if (response.errorMessage) {
				setError(response.errorMessage);
				return;
			}
		}
	}

	// used to control whether UserInput should be shown
	function resetUserInput() {
		updateSentence('');
		Cookies.remove(SENTENCE_TO_BE_PROCESSED);
		setError('');
	}

	function resetTranslationText() {
		window.localStorage.removeItem(TRANSLATION_TEXT); // To meet the condition for the useEffect call to reset the translation as new data.
		setTranslation(data!); // For cases where the refetched translation is the same as before, it essentially resets the translation since the useEffect call would not be invoked.
	}

	return (
		<div>
			<div>
				<h2>New Vocabulary Entry</h2>
				<p>{sentence}</p>
				<h2>Translation</h2>
				{translationNode}
			</div>
			<div>
				<button
					onClick={() => {
						setError(''); // Otherwise, the submit button would stay disabled.
						resetTranslationText();
						mutate();
					}}
					disabled={isLoading || isValidating}
				>
					Retry Translation
				</button>
				<button
					onClick={() => {
						resetTranslationText();
						resetUserInput();
						updateShouldClearUserInput(false);
					}}
				>
					Cancel
				</button>
				{!isLoading && (
					<button onClick={handleSubmitNewEntry} disabled={error !== '' || isValidating}>
						Finish Editing
					</button>
				)}
			</div>
			{error && <Toast toastType='error' content={error} />}
		</div>
	);
}

export default SubmitNewCollectionEntry;
