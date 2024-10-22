import * as React from 'react';
import useSWRImmutable from 'swr/immutable';
import axios from 'axios';
import Cookies from 'js-cookie';
import { startTransition } from 'react';

import { FETCH_TRANSLATE_ROUTE, SENTENCE_TO_BE_PROCESSED, USER_EMAIL } from '@/constants';
import { createVocabEntry } from '@/actions';
import { CreateVocabEntryInputSchema } from '@/lib/dataValidation';
import Toast from '@/components/Toast';
import { constructZodErrorMessage } from '@/helpers';
import { useOptimisticVocabContext } from '@/components/OptimisticVocabProvider';
import SentenceTranslation from '@/components/SentenceTranslation';

var fetcher = async (url: string, sentence: string): Promise<string> => {
	let response = await axios.post(url, {
		sentence,
	});
	return response.data;
};

function NewCollectionEntry({
	sentence,
	updateSentence,
	updateShouldClearUserInput,
}: {
	sentence: string;
	updateSentence: (text: string) => void;
	updateShouldClearUserInput: (value: boolean) => void;
}) {
	let [error, setError] = React.useState('');
	let [translation, setTranslation] = React.useState('');
	function alterTranslation(text: string) {
		setTranslation(text);
	}

	let { addOptimisticVocabEntry } = useOptimisticVocabContext();

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
			setError(error.response.data ? error.response.data : error.message); // error.response.data could be empty.
		},
		onSuccess: (data) => {
			setTranslation(data);
		},
	});

	let translationNode: React.ReactNode;
	if (isLoading) {
		translationNode = <p>Translating...</p>;
	} else if (swrError) {
		translationNode = <p>Error occurred during the process; you can hit the button below to try again.</p>;
	} else if (data) {
		translationNode = <SentenceTranslation alterTranslation={alterTranslation} translation={translation} />;
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

			// Put the resetting logic before the create action to avoid this component being evaluated on the server. Also get a snappy UI by doing this.
			resetUserInput();
			updateShouldClearUserInput(true);
			let response = await createVocabEntry.bind(null, data)();
			if (response.errorMessage) {
				setError(response.errorMessage);
				return;
			}
		}
	}

	function resetUserInput() {
		updateSentence('');
		Cookies.remove(SENTENCE_TO_BE_PROCESSED);
		setError('');
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
				<button onClick={() => mutate()} disabled={isLoading || isValidating}>
					Retry Translation
				</button>
				<button onClick={resetUserInput}>Cancel</button>
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

export default NewCollectionEntry;
