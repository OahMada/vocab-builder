import * as React from 'react';
import axios from 'axios';
import { useSWRConfig } from 'swr';
import { produce } from 'immer';

import { FETCH_PHONETIC_SYMBOL_ROUTE, PHONETIC_SYMBOLS } from '@/constants';
import useSWRImmutable from 'swr/immutable';
import { getErrorMessageFromError } from '@/helpers';
import useLocalStoragePersist from '@/hooks/useLocalStoragePersist';
import { PhoneticSymbols } from '@/types';
import { useErrorMessageContext } from '@/components/ErrorMessageProvider';

import { PopoverContent, PopoverRoot, PopoverTrigger } from '@/components/PopOver';

var fetcher = async (url: string, word: string): Promise<string> => {
	let response = await axios.post(url, {
		word,
	});
	return response.data;
};

let Sentence = React.forwardRef<PhoneticSymbols, { segmentedText: Intl.SegmentData[] }>(function Sentence({ segmentedText }, ref) {
	let [phoneticSymbols, setPhoneticSymbols] = React.useState<null | PhoneticSymbols>(null);
	let { updateError } = useErrorMessageContext();

	React.useImperativeHandle(ref, () => {
		return phoneticSymbols ?? {};
	});

	let updatePhoneticSymbols = React.useCallback((word: string, symbol: string) => {
		setPhoneticSymbols((prevState) => {
			if (!prevState) {
				throw new Error('The phoneticSymbols state was null.');
			}
			let nextSymbols = produce(prevState, (draft) => {
				draft[word] = symbol;
			});

			return nextSymbols;
		});
	}, []);

	function removeOnePhoneticSymbol(word: string) {
		return () => {
			if (!phoneticSymbols) {
				throw new Error('The phoneticSymbols state was null.');
			}
			let nextSymbols = produce(phoneticSymbols, (draft) => {
				delete draft[word];
			});
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
		<>
			<div>
				{[...segmentedText].map(({ segment, isWordLike }, index) => {
					if (!isWordLike) {
						return segment;
					}
					return (
						<React.Fragment key={index}>
							{phoneticSymbols && phoneticSymbols[segment] ? (
								<>
									{segment}
									<PhoneticSymbol symbol={phoneticSymbols[segment]} removeOnePhoneticSymbol={removeOnePhoneticSymbol(segment)} />
								</>
							) : (
								<Word triggerWord={segment} updateError={updateError} updatePhoneticSymbols={updatePhoneticSymbols} />
							)}
						</React.Fragment>
					);
				})}
			</div>
		</>
	);
});

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
				let errorMessage = getErrorMessageFromError(error);
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
		<PopoverRoot open={popOverOpen} onOpenChange={(open) => setPopOverOpen(open)}>
			<PopoverTrigger asChild>
				<button aria-label={`Fetch the phonetic symbol for the word ${triggerWord}`}>{triggerWord}</button>
			</PopoverTrigger>
			<PopoverContent>
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
			</PopoverContent>
		</PopoverRoot>
	);
}

function PhoneticSymbol({ symbol, removeOnePhoneticSymbol }: { symbol: string; removeOnePhoneticSymbol: () => void }) {
	let [popOverOpen, setPopOverOpen] = React.useState(false);

	return (
		<PopoverRoot open={popOverOpen} onOpenChange={(open) => setPopOverOpen(open)}>
			<PopoverTrigger asChild>
				<button>
					<small>
						<code> {` ${symbol} `}</code>
					</small>
				</button>
			</PopoverTrigger>
			<PopoverContent>
				<button
					onClick={() => {
						removeOnePhoneticSymbol();
						setPopOverOpen(false);
					}}
				>
					Remove
				</button>
			</PopoverContent>
		</PopoverRoot>
	);
}
