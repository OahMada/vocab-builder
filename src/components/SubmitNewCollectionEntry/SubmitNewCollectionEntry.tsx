import * as React from 'react';
import useSWRImmutable from 'swr/immutable';
import { useSWRConfig } from 'swr';
import axios from 'axios';
import Cookies from 'js-cookie';
import { startTransition } from 'react';

import { VocabEntry } from '@/types';

import { FETCH_TRANSLATE_ROUTE, SENTENCE_TEXT, USER_EMAIL, TRANSLATION_TEXT, NOTE_TEXT, PHONETIC_SYMBOLS } from '@/constants';

import { createVocabEntry } from '@/actions';

import { CreateVocabEntryInputSchema } from '@/lib/dataValidation';
import { constructZodErrorMessage, getErrorMessage } from '@/helpers';
import useLocalStoragePersist, { deleteAppDataEntry } from '@/hooks/useLocalStoragePersist';
import { PhoneticSymbols } from '@/types';

import SentenceTranslation from '@/components/SentenceTranslation';
import Toast from '@/components/Toast';
import Note from '@/components/Note';
import Sentence from '@/components/Sentence';

var fetcher = async (url: string, sentence: string): Promise<string> => {
	let response = await axios.post(url, {
		sentence,
	});
	return response.data;
};

function SubmitNewCollectionEntry({
	sentence,
	addOptimisticVocabEntry,
	updateSentence,
	updateShouldClearUserInput,
}: {
	sentence: string;
	addOptimisticVocabEntry: (value: VocabEntry) => void;
	updateSentence: (text: string) => void;
	updateShouldClearUserInput: (value: boolean) => void;
}) {
	let segmenter = new Intl.Segmenter([], { granularity: 'word' });
	let segmentedText = [...segmenter.segment(sentence)];

	let [error, setError] = React.useState('');
	let [translation, setTranslation] = React.useState<null | string>(null);
	let [note, setNote] = React.useState<null | string>(null);
	let { mutate } = useSWRConfig();
	let phoneticSymbolRef = React.useRef<PhoneticSymbols>(null);

	let {
		data,
		error: swrError,
		isLoading,
		isValidating,
	} = useSWRImmutable([FETCH_TRANSLATE_ROUTE, sentence], ([url, sentence]) => fetcher(url, sentence), {
		shouldRetryOnError: false,
		onError: (error) => {
			if (process.env.NODE_ENV === 'development') console.log(error);
			let errorMessage = getErrorMessage(error);
			setError(errorMessage);
		},
	});

	let updateTranslation = React.useCallback(
		function (text: string) {
			if (data && text === '') {
				// empty string value is set by useLocalStoragePersist
				setTranslation(data);
			} else if (text) {
				// To preserve user editing after a page refresh.
				setTranslation(text);
			}
		},
		[data]
	);
	useLocalStoragePersist<string>({
		defaultValue: '',
		localStorageKey: TRANSLATION_TEXT,
		valueToSave: translation,
		stateSetter: updateTranslation,
	});
	useLocalStoragePersist<string>({
		defaultValue: '',
		localStorageKey: NOTE_TEXT,
		valueToSave: note,
		stateSetter: React.useCallback((value: string) => setNote(value), []),
	});

	let translationNode: React.ReactNode;
	if (isLoading || isValidating) {
		translationNode = <p>Translating...</p>;
	} else if (swrError) {
		translationNode = <p>Error occurred during the process; you can hit the button below to try again.</p>;
	} else if (translation) {
		translationNode = <SentenceTranslation updateTranslation={(translation: string) => setTranslation(translation)} translation={translation} />;
	}

	// used to control whether UserInput should be shown
	function resetSentence() {
		updateSentence('');
		Cookies.remove(SENTENCE_TEXT);
	}

	function resetTranslationText() {
		deleteAppDataEntry(TRANSLATION_TEXT); // To meet the condition for the useEffect call to reset the translation as new data.
		if (data) setTranslation(data); // For cases where the refetched translation is the same as before, since the useEffect call would not be invoked. This essentially resets the translation.
	}

	function resetNoteText() {
		deleteAppDataEntry(NOTE_TEXT);
	}

	function resetPhoneticSymbols() {
		deleteAppDataEntry(PHONETIC_SYMBOLS);
	}

	function resetAll(clearUserInput: boolean) {
		resetSentence();
		resetTranslationText();
		resetNoteText();
		resetPhoneticSymbols();
		setError('');
		updateShouldClearUserInput(clearUserInput);
	}

	function constructSentencePlusPhoneticSymbols() {
		let phoneticSymbols = phoneticSymbolRef.current;
		if (phoneticSymbols === null) {
			throw new Error('the value of phoneticSymbolRef.current is null.');
		} else {
			return segmentedText.reduce((acc, { segment, isWordLike }) => {
				if (isWordLike && phoneticSymbols[segment]) {
					return `${acc + segment} <small> ${phoneticSymbols[segment]} </small> `;
				}
				return (acc += segment);
			}, '');
		}
	}

	async function handleSubmitNewEntry() {
		let sentencePlusPhoneticSymbols = constructSentencePlusPhoneticSymbols();
		let newEntry = {
			sentence,
			sentencePlusPhoneticSymbols,
			translation,
			note,
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
					sentencePlusPhoneticSymbols: data.sentencePlusPhoneticSymbols,
					translation: data.translation,
				});
			});

			// Put the resetting logic before the create action to get a snappy UI.
			resetAll(true);
			let response = await createVocabEntry.bind(null, data)();
			if (response.errorMessage) {
				setError(response.errorMessage);
				return;
			}
		}
	}

	return (
		<div>
			<div>
				<h2>New Vocabulary Entry</h2>
				<Sentence segmentedText={segmentedText} ref={phoneticSymbolRef} />
				<h2>Translation</h2>
				{translationNode}
				<h3>Note</h3>
				<Note note={note === null ? '' : note} updateNote={(note: string) => setNote(note)} />
			</div>
			<div>
				<button
					onClick={() => {
						setError(''); // Otherwise, the submit button would stay disabled.
						resetTranslationText();
						mutate([FETCH_TRANSLATE_ROUTE, sentence]);
					}}
					disabled={isLoading || isValidating}
				>
					Retry Translation
				</button>
				<button
					onClick={() => {
						resetAll(false);
					}}
				>
					Cancel
				</button>
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

export default SubmitNewCollectionEntry;

/**
 * cases where data is gonna change
 * 1, a new sentence
 * 		a, step one: reset after submitting => delete key in local storage; reset to old data
 * 		b, component remount after user input => translation set to an empty string, and set to data when it's available
 * 2, refetch translation
 * 		a, step one: reset after clicking refetch button => delete key in local storage; reset to old data, not going to trigger useEffect call yet
 * 		b, same data arrives, no effect call runs, just set to old data; or new data arrives, useEffect call runs,
 */
