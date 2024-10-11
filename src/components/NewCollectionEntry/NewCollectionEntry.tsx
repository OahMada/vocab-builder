import * as React from 'react';
import useSWRImmutable from 'swr/immutable';
import axios from 'axios';

import { FETCH_TRANSLATE_ROUTE } from '@/constants';

var fetcher = async (url: string, sentence: string): Promise<string> => {
	const response = await axios.post(url, {
		sentence,
	});
	return response.data;
};

function NewCollectionEntry({ sentence, updateSentence }: { sentence: string; updateSentence: (text: string) => void }) {
	let { data, error, isLoading, mutate } = useSWRImmutable([FETCH_TRANSLATE_ROUTE, sentence], ([url, sentence]) => fetcher(url, sentence));

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
				<button onClick={() => updateSentence('')}>Cancel</button>
				<button>Finish Editing</button>
			</div>
		</div>
	);
}

export default NewCollectionEntry;
