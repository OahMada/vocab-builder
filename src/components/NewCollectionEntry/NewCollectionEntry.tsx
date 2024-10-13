import * as React from 'react';
import useSWRImmutable from 'swr/immutable';
import axios from 'axios';
import Cookies from 'js-cookie';

import { FETCH_TRANSLATE_ROUTE, SENTENCE_TO_BE_PROCESSED, USER_EMAIL } from '@/constants';
import { createVocabEntry, NewEntry } from '@/actions';

var fetcher = async (url: string, sentence: string): Promise<string> => {
	const response = await axios.post(url, {
		sentence,
	});
	return response.data;
};

function NewCollectionEntry({ sentence, updateSentence }: { sentence: string; updateSentence: (text: string) => void }) {
	let { data, error, isLoading, mutate } = useSWRImmutable([FETCH_TRANSLATE_ROUTE, sentence], ([url, sentence]) => fetcher(url, sentence));

	let newEntry: NewEntry = {
		sentence,
		translation: data!,
		userEmail: USER_EMAIL,
	};

	const createVocabEntryWithData = createVocabEntry.bind(null, newEntry);

	// TODO finish and upload data to database
	// TODO Error handling -> retry

	return (
		<div>
			<div>
				<h1>New Vocabulary Entry</h1>
				<p>{sentence}</p>
				<p>{data}</p>
			</div>
			<div>
				<button onClick={() => mutate()}>Retry Translation</button>
				<button
					onClick={() => {
						updateSentence('');
						Cookies.remove(SENTENCE_TO_BE_PROCESSED);
					}}
				>
					Cancel
				</button>
				<button
					onClick={async () => {
						await createVocabEntryWithData();
					}}
				>
					Finish Editing
				</button>
			</div>
		</div>
	);
}

export default NewCollectionEntry;
