import * as React from 'react';
import * as Popover from '@radix-ui/react-popover';
import axios from 'axios';
import { FETCH_PHONETIC_SYMBOL_ROUTE } from '@/constants';
import useSWRImmutable from 'swr/immutable';
import { getErrorMessage } from '@/helpers';

var fetcher = async (url: string, word: string): Promise<string> => {
	let response = await axios.post(url, {
		word,
	});
	return response.data;
};

function Sentence({ sentence, updateError }: { sentence: string; updateError: (errorMessage: string) => void }) {
	let wordArr = sentence.split(' ');

	let [fetchTarget, setFetchTarget] = React.useState<string | null>(null);

	let {
		data,
		error: swrError,
		isLoading,
	} = useSWRImmutable(fetchTarget ? [FETCH_PHONETIC_SYMBOL_ROUTE, fetchTarget] : null, ([url, word]) => fetcher(url, word), {
		shouldRetryOnError: false,
		onError: (error) => {
			if (process.env.NODE_ENV === 'development') console.log(error);
			let errorMessage = getErrorMessage(error);
			updateError(errorMessage);
		},
		onSuccess(data, key) {
			console.log(data, key);
			setFetchTarget(null);
		},
	});

	function getIPA(word: string) {
		setFetchTarget(word);
	}

	return (
		<div>
			{wordArr.map((word, index) => {
				return (
					<Popover.Root key={index}>
						<Popover.Trigger asChild>
							<button aria-label={`Fetch the phonetic symbol for the word ${word}`}>{word}</button>
						</Popover.Trigger>
						<Popover.Portal>
							<Popover.Content sideOffset={5} side='top'>
								<button onClick={() => getIPA(word)}>Get IPA</button>
								<Popover.Arrow />
							</Popover.Content>
						</Popover.Portal>
					</Popover.Root>
				);
			})}
		</div>
	);
}

export default Sentence;

// TODO add fetched phonetic symbol to sentence; save to local storage; how to close popover after data fetching
