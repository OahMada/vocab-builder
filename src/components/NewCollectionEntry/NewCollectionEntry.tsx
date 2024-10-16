import * as React from 'react';
import useSWRImmutable from 'swr/immutable';
import axios from 'axios';
import Cookies from 'js-cookie';

import { FETCH_TRANSLATE_ROUTE, SENTENCE_TO_BE_PROCESSED, USER_EMAIL } from '@/constants';
import { createVocabEntry } from '@/actions';
import { CreateVocabEntryInputSchema } from '@/types';
import Toast from '@/components/Toast';

var fetcher = async (url: string, sentence: string): Promise<string> => {
	const response = await axios.post(url, {
		sentence,
	});
	return response.data;
};

function NewCollectionEntry({ sentence, updateSentence }: { sentence: string; updateSentence: (text: string) => void }) {
	let {
		data: translation,
		// error,
		// isLoading,
		mutate,
	} = useSWRImmutable([FETCH_TRANSLATE_ROUTE, sentence], ([url, sentence]) => fetcher(url, sentence));

	async function clientAction() {
		let newEntry = {
			sentence,
			translation,
			// note,
			userEmail: USER_EMAIL,
		};

		let result = CreateVocabEntryInputSchema.safeParse(newEntry);
		if (result.error) {
			console.log(result.error);
			// TODO error handling
		} else {
			await createVocabEntry.bind(null, result.data)();
		}
	}

	function resetUserInput() {
		updateSentence('');
		Cookies.remove(SENTENCE_TO_BE_PROCESSED);
	}

	// TODO finish and upload data to database
	// TODO Error handling -> retry

	return (
		<div>
			<div>
				<h1>New Vocabulary Entry</h1>
				<p>{sentence}</p>
				<p>{translation}</p>
			</div>
			<div>
				<button onClick={() => mutate()}>Retry Translation</button>
				<button onClick={resetUserInput}>Cancel</button>
				<button
					onClick={async () => {
						await clientAction();
						resetUserInput();
					}}
				>
					Finish Editing
				</button>
			</div>
			<Toast content='hello world' />
		</div>
	);
}

export default NewCollectionEntry;
