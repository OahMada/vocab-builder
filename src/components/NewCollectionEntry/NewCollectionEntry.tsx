import * as React from 'react';
import useSWRImmutable from 'swr/immutable';
import axios from 'axios';

var fetcher = async (url: string, sentence: string): Promise<string> => {
	const response = await axios.post(url, {
		sentence,
	});
	return response.data;
};

function NewCollectionEntry({ sentence }: { sentence: string }) {
	let { data, error } = useSWRImmutable(['/api/fetch-translation', sentence], ([url, sentence]) => fetcher(url, sentence));

	console.log(data, error);

	return <div>{sentence}</div>;
}

export default NewCollectionEntry;
