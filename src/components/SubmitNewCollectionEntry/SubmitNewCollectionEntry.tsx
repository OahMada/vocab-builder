import * as React from 'react';
import useSWRImmutable from 'swr/immutable';
import { useSWRConfig } from 'swr';
import axios from 'axios';
import Cookies from 'js-cookie';
import { produce } from 'immer';

import { VocabEntry } from '@/types';

import {
	FETCH_TRANSLATE_ROUTE,
	SENTENCE_TEXT,
	TRANSLATION_TEXT,
	NOTE_TEXT,
	PHONETIC_SYMBOLS,
	NOTE_EDIT_MODE,
	TRANSLATION_EDIT_MODE,
} from '@/constants';

import { createVocabEntry, CreateVocabEntryReturnType } from '@/actions';

import { CreateVocabEntryInputSchema } from '@/lib/dataValidation';
import { constructZodErrorMessage, getErrorMessageFromError } from '@/helpers';
import useLocalStoragePersist, { deleteAppDataEntry } from '@/hooks/useLocalStoragePersist';
import { PhoneticSymbols } from '@/types';
import { useErrorMessageContext } from '@/components/ErrorMessageProvider';

import SentenceTranslation, { TranslationFallback } from '@/components/SentenceTranslation';
import Note from '@/components/Note';
import Sentence from '@/components/Sentence';
import ErrorMsg from '@/components/ErrorMsg';
import ButtonGroup from '@/components/ButtonGroup';
import Button from '@/components/Button';
import CardPiece from './CardPiece';
import HeaderTag from '@/components/HeaderTag';
import Card from '@/components/Card';

interface EditingState {
	noteEditing: boolean;
	translationEditing: boolean;
}

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
	let [isPending, startTransition] = React.useTransition();
	let segmenter = new Intl.Segmenter([], { granularity: 'word' });
	let segmentedText = [...segmenter.segment(sentence)];

	let [editingState, setEditingState] = React.useState<EditingState>({
		noteEditing: false,
		translationEditing: false,
	});
	let isEditing = editingState.noteEditing || editingState.translationEditing;

	function handleUpdateEditingState(key: keyof EditingState, node: HTMLTextAreaElement | null) {
		let newState: EditingState;
		if (node) {
			newState = produce(editingState, (draft) => {
				draft[key] = true;
			});
		} else {
			newState = produce(editingState, (draft) => {
				draft[key] = false;
			});
		}
		setEditingState(newState);
	}

	let { errorMsg, updateError } = useErrorMessageContext();
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
			let errorMessage = getErrorMessageFromError(error);
			updateError(errorMessage);
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

	function resetTranslation() {
		deleteAppDataEntry(TRANSLATION_TEXT); // To meet the condition for the useEffect call to reset the translation as new data.
		deleteAppDataEntry(TRANSLATION_EDIT_MODE);
		if (data) setTranslation(data); // For cases where the refetched translation is the same as before, since the useEffect call would not be invoked. This essentially resets the translation.
	}

	function reset(clearUserInput: boolean) {
		// used to control whether UserInput should be shown
		updateSentence('');
		Cookies.remove(SENTENCE_TEXT);

		resetTranslation();

		deleteAppDataEntry(NOTE_TEXT);
		deleteAppDataEntry(NOTE_EDIT_MODE);
		deleteAppDataEntry(PHONETIC_SYMBOLS);

		updateError('');

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
		};

		let result = CreateVocabEntryInputSchema.safeParse(newEntry);
		if (result.error) {
			let errorMessage = constructZodErrorMessage(result.error);
			updateError(errorMessage);
			return;
		}

		let data = result.data;
		let promise: CreateVocabEntryReturnType;
		startTransition(() => {
			promise = createVocabEntry.bind(null, data)();
		});
		let response = await promise!;
		if ('errorMessage' in response) {
			updateError(response.errorMessage);
			return;
		}

		let addedEntry = response.data;
		startTransition(() => {
			// If not wrapped in startTransition, there would be an error: An optimistic state update occurred outside a transition or action. To fix, move the update to an action, or wrap with startTransition.
			addOptimisticVocabEntry({
				id: addedEntry.id,
				note: addedEntry.note,
				sentencePlusPhoneticSymbols: addedEntry.sentencePlusPhoneticSymbols,
				translation: addedEntry.translation,
			});
		});

		reset(true); // This needs to be at the last, or else any errors won't have the chance to show up since the UI would have switched away.
	}

	let translationNode: React.ReactNode;
	if (isLoading || isValidating) {
		translationNode = (
			<TranslationFallback>
				<p>Translating...</p>
			</TranslationFallback>
		);
	} else if (swrError) {
		translationNode = (
			<TranslationFallback>
				<p>Error occurred during the process; you can hit the button below to try again.</p>
			</TranslationFallback>
		);
	} else if (translation) {
		translationNode = (
			<SentenceTranslation
				updateTranslation={(translation: string) => setTranslation(translation)}
				translation={translation}
				ref={handleUpdateEditingState.bind(null, 'translationEditing')}
				retryBtn={
					<Button
						onClick={() => {
							updateError(''); // Otherwise, the submit button would stay disabled.
							resetTranslation();
							mutate([FETCH_TRANSLATE_ROUTE, sentence]);
						}}
					>
						Re-translate
					</Button>
				}
			/>
		);
	}

	return (
		<Card>
			<CardPiece>
				<HeaderTag level={2}>New Vocabulary Entry</HeaderTag>
				{/* There's some loading because I've setup PopOver component to lazy load. */}
				<React.Suspense fallback={<p>Loading...</p>}>
					<Sentence segmentedText={segmentedText} ref={phoneticSymbolRef} />
				</React.Suspense>
			</CardPiece>
			<CardPiece>
				<HeaderTag level={3}>Translation</HeaderTag>
				{translationNode}
			</CardPiece>
			<CardPiece>
				<HeaderTag level={3}>Note</HeaderTag>
				<Note
					note={note === null ? '' : note}
					updateNote={(note: string) => setNote(note)}
					ref={handleUpdateEditingState.bind(null, 'noteEditing')}
				/>
			</CardPiece>
			<ButtonGroup>
				<Button
					onClick={() => {
						reset(false);
					}}
				>
					Cancel
				</Button>
				{!isLoading && (
					<Button onClick={handleSubmitNewEntry} disabled={errorMsg !== '' || isValidating || isEditing}>
						{isPending ? 'Submitting...' : 'Finish'}
					</Button>
				)}
			</ButtonGroup>
			<ErrorMsg />
		</Card>
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
