import * as React from 'react';
import axios from 'axios';
import { useSWRConfig } from 'swr';

import { FETCH_PHONETIC_SYMBOL_ROUTE, PHONETIC_SYMBOLS } from '@/constants';
import useSWRImmutable from 'swr/immutable';
import { getErrorMessage } from '@/helpers';
import useLocalStoragePersist from '@/hooks/useLocalStoragePersist';

import PopOver from '@/components/PopOver';
import Toast from '../Toast';

interface PhoneticSymbols {
	[key: string]: string;
}

var fetcher = async (url: string, word: string): Promise<string> => {
	let response = await axios.post(url, {
		word,
	});
	return response.data;
};

function Sentence({ sentence }: { sentence: string }) {
	let wordArr = sentence.split(' ');
	let [error, setError] = React.useState('');
	let [phoneticSymbols, setPhoneticSymbols] = React.useState<null | PhoneticSymbols>(null);

	let updatePhoneticSymbols = React.useCallback((word: string, symbol: string) => {
		setPhoneticSymbols((prevState) => {
			let nextSymbols = { ...prevState, [word]: symbol };
			return nextSymbols;
		});
	}, []);

	function removeOnePhoneticSymbol(word: string) {
		return () => {
			let nextSymbols = { ...phoneticSymbols };
			delete nextSymbols[word];
			setPhoneticSymbols(nextSymbols);
		};
	}

	let updateError = React.useCallback((errorMessage: string) => setError(errorMessage), []);

	useLocalStoragePersist({
		localStorageKey: PHONETIC_SYMBOLS,
		defaultValue: React.useMemo(() => ({}), []),
		valueToSave: React.useMemo(() => phoneticSymbols, [phoneticSymbols]),
		stateSetter: React.useCallback((value: { [key: string]: string }) => setPhoneticSymbols(value), []),
	});

	return (
		<>
			<div>
				{wordArr.map((word, index) => {
					return (
						<React.Fragment key={index}>
							{phoneticSymbols && phoneticSymbols[word] ? (
								<>
									{word}
									<PhoneticSymbol symbol={phoneticSymbols[word]} removeOnePhoneticSymbol={removeOnePhoneticSymbol(word)} />
								</>
							) : (
								<Word triggerWord={word} updateError={updateError} updatePhoneticSymbols={updatePhoneticSymbols} />
							)}
						</React.Fragment>
					);
				})}
			</div>
			{error && <Toast toastType='error' content={error} />}
		</>
	);
}

export default Sentence;

function Word({
	triggerWord,
	updateError,
	updatePhoneticSymbols,
}: {
	triggerWord: string;
	updateError: (errorMessage: string) => void;
	updatePhoneticSymbols: (word: string, symbol: string) => void;
}) {
	let [popOverOpen, setPopOverOpen] = React.useState(false);
	let [shouldFetch, setShouldFetch] = React.useState<boolean>(false);

	let { mutate } = useSWRConfig();

	let { isLoading, data, error } = useSWRImmutable(
		shouldFetch ? [FETCH_PHONETIC_SYMBOL_ROUTE, triggerWord] : null,
		([url, word]) => fetcher(url, word),
		{
			shouldRetryOnError: false,
			onError: (error) => {
				if (process.env.NODE_ENV === 'development') console.log(error);
				let errorMessage = getErrorMessage(error);
				updateError(errorMessage);
			},
		}
	);

	// to ensure the once removed phonetic symbol can be added back.
	React.useEffect(() => {
		if (data) {
			setPopOverOpen(false);
			updatePhoneticSymbols(triggerWord, data);
		}
	}, [data, triggerWord, updatePhoneticSymbols]);

	return (
		<PopOver
			trigger={<button aria-label={`Fetch the phonetic symbol for the word ${triggerWord}`}>{triggerWord}</button>}
			open={popOverOpen}
			onOpenChange={(open) => setPopOverOpen(open)}
		>
			<button
				onClick={() => {
					setShouldFetch(true);
					if (error) {
						updateError('');
						mutate([FETCH_PHONETIC_SYMBOL_ROUTE, triggerWord]);
					}
				}}
			>
				{isLoading ? 'Loading' : 'Get IPA'}
			</button>
		</PopOver>
	);
}

function PhoneticSymbol({ symbol, removeOnePhoneticSymbol }: { symbol: string; removeOnePhoneticSymbol: () => void }) {
	let [popOverOpen, setPopOverOpen] = React.useState(false);

	return (
		<PopOver
			trigger={
				<button>
					<code> {symbol}</code>
				</button>
			}
			open={popOverOpen}
			onOpenChange={(open) => setPopOverOpen(open)}
		>
			<button
				onClick={() => {
					removeOnePhoneticSymbol();
					setPopOverOpen(false);
				}}
			>
				Remove
			</button>
		</PopOver>
	);
}
