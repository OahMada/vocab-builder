import * as React from 'react';
import axios from 'axios';

import { FETCH_PHONETIC_SYMBOL_ROUTE, PHONETIC_SYMBOLS } from '@/constants';
import useSWRImmutable from 'swr/immutable';
import { getErrorMessage } from '@/helpers';
import useLocalStoragePersist from '@/hooks/useLocalStoragePersist';

import PopOver from '@/components/PopOver';

interface PhoneticSymbols {
	[key: string]: string;
}

var fetcher = async (url: string, word: string): Promise<string> => {
	let response = await axios.post(url, {
		word,
	});
	return response.data;
};

function Sentence({ sentence, updateError }: { sentence: string; updateError: (errorMessage: string) => void }) {
	let wordArr = sentence.split(' ');
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

	useLocalStoragePersist({
		localStorageKey: PHONETIC_SYMBOLS,
		defaultValue: React.useMemo(() => ({}), []),
		valueToSave: React.useMemo(() => phoneticSymbols, [phoneticSymbols]),
		stateSetter: React.useCallback((value: { [key: string]: string }) => setPhoneticSymbols(value), []),
	});

	return (
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

	let { isLoading, data, mutate } = useSWRImmutable(
		shouldFetch ? [FETCH_PHONETIC_SYMBOL_ROUTE, triggerWord] : null,
		([url, word]) => fetcher(url, word),
		{
			shouldRetryOnError: false,
			onError: (error) => {
				if (process.env.NODE_ENV === 'development') console.log(error);
				let errorMessage = getErrorMessage(error);
				updateError(errorMessage);
			},
			onSuccess: (data) => {
				console.log('onSuccess', data);
			},
		}
	);

	// TODO the symbol appears super snappy, where it come from? Is localStorage cache working?

	// A failed attempt: it works, but it's ugly.
	// useLocalStoragePersist({
	// 	localStorageKey: PHONETIC_SYMBOLS,
	// 	defaultValue: React.useMemo(() => ({}), []),
	// 	valueToSave: React.useMemo(() => phoneticSymbols, [phoneticSymbols]),
	// 	stateUpdater: React.useCallback(
	// 		(savedValue: null | string) => {
	// 			if (!savedValue) return;
	// 			let savedSymbols = JSON.parse(savedValue) as PhoneticSymbols;
	// 			if (!savedSymbols[triggerWord] && data) {
	// 				setShouldFetch(false);
	// 				setPopOverOpen(false);
	// 				updatePhoneticSymbols(triggerWord, data);
	// 			} else if (savedSymbols[triggerWord]) {
	// 				updatePhoneticSymbols(triggerWord, savedSymbols[triggerWord]);
	// 			}
	// 		},
	// 		[data, triggerWord, updatePhoneticSymbols]
	// 	),
	// });

	// to ensure the once removed phonetic symbol can be added back.
	React.useEffect(() => {
		if (data) {
			setShouldFetch(false);
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
					if (data) {
						mutate(); // TODO in the case of error
					} else {
						setShouldFetch(true);
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
