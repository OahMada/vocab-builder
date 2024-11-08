export const SITE_TITLE = 'Vocab Builder';
export const SITE_DESC = 'A tool to help build vocabulary for reciting with Anki.';
export const SENTENCE_SAMPLE = "We sat together at one summer's end,That beautiful mild woman, your close friend.";

export const USER_INPUT_SENTENCE = 'user-input-sentence';
export const SENTENCE_TEXT = 'sentence-text';
export const TRANSLATION_TEXT = 'translation-text';
export const NOTE_TEXT = 'note-text';
export const PHONETIC_SYMBOLS = 'phonetic-symbols';
export const NOTE_EDIT_MODE = 'note-edit-mode';
export const TRANSLATION_EDIT_MODE = 'translation-edit-mode';

export const FETCH_TRANSLATE_ROUTE = process.env.NODE_ENV === 'development' ? '/api/fetch-translation?mock=true' : '/api/fetch-translation';
export const FETCH_PHONETIC_SYMBOL_ROUTE =
	process.env.NODE_ENV === 'development' ? '/api/fetch-phonetic-symbol?mock=true' : '/api/fetch-phonetic-symbol';

export const USER_EMAIL = 'adam@gmail.com';
export const DATABASE_USER_ID = '670bf138f51931ba3ec85d84';

export const VOCAB_LIST_VALIDATION_TAG = 'vocab-list';
export const ENTRIES_PER_PAGE = 3;
