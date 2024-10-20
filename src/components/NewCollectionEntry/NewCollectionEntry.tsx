import * as React from 'react';
import useSWRImmutable from 'swr/immutable';
import axios from 'axios';
import Cookies from 'js-cookie';

import { FETCH_TRANSLATE_ROUTE, SENTENCE_TO_BE_PROCESSED, USER_EMAIL } from '@/constants';
import { createVocabEntry } from '@/actions';
import { CreateVocabEntryInputSchema } from '@/lib/dataValidation';
import Toast from '@/components/Toast';
import { constructZodErrorMessage } from '@/helpers';
import { useOptimisticVocabContext } from '@/components/OptimisticVocabProvider';

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
	let { addOptimisticVocabEntry } = useOptimisticVocabContext();
	let {
		data: translation,
		error: swrError,
		isLoading,
		mutate,
	} = useSWRImmutable([FETCH_TRANSLATE_ROUTE, sentence], ([url, sentence]) => fetcher(url, sentence), {
		shouldRetryOnError: false,
		onError: (error) => {
			if (process.env.NODE_ENV === 'development') console.log(error);
			setError(error.response.data ? error.response.data : error.message); // error.response.data could be empty.
		},
	});

	let translationNode: React.ReactNode;
	if (isLoading) {
		translationNode = <p>Translating...</p>;
	} else if (swrError) {
		translationNode = <p>Error occurred during the process; you can hit the button below to try again.</p>;
	} else {
		translationNode = <p>{translation}</p>;
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
			addOptimisticVocabEntry({
				id: 'optimistic_entry',
				note: data.note ?? '',
				sentence: data.sentence,
				translation: data.translation,
			});
			let response = await createVocabEntry.bind(null, data)();
			if (response.errorMessage) {
				setError(response.errorMessage);
				return;
			}
		}
		resetUserInput();
		updateShouldClearUserInput(true);
	}

	function resetUserInput() {
		setError('');
		updateSentence('');
		Cookies.remove(SENTENCE_TO_BE_PROCESSED);
	}

	return (
		<div>
			<div>
				<h1>New Vocabulary Entry</h1>
				<p>{sentence}</p>
				{translationNode}
			</div>
			<div>
				<button onClick={() => mutate()}>Retry Translation</button>
				<button onClick={resetUserInput}>Cancel</button>
				<button onClick={handleSubmitNewEntry} disabled={error !== ''}>
					Finish Editing
				</button>
			</div>
			{error && <Toast toastType='error' content={error} />}
		</div>
	);
}

export default NewCollectionEntry;
