import { SignInPageErrorParam } from '@auth/core/types';

export const SITE_TITLE = 'Vocab Builder';
export const SITE_DESC = 'A tool to help build vocabulary for reciting with Anki.';

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

export const VOCAB_LIST_VALIDATION_TAG = 'vocab-list';
export const ENTRIES_PER_PAGE = 10;

// https://github.com/nextauthjs/next-auth/blob/3ec06842682a31e53fceabca701a362abda1e7dd/packages/core/src/types.ts#L204
export const SIGNINERRORS: Record<SignInPageErrorParam | 'default', string> = {
	default: 'Unable to sign in.',
	Signin: 'Try signing in with a different account.',
	OAuthSignin: 'Try signing in with a different account.',
	OAuthCallbackError: 'Try signing in with a different account.',
	OAuthCreateAccount: 'Try signing in with a different account.',
	EmailCreateAccount: 'Try signing in with a different account.',
	Callback: 'Try signing in with a different account.',
	OAuthAccountNotLinked: 'To confirm your identity, sign in with the same account you used originally.',
	EmailSignin: 'The e-mail could not be sent.',
	CredentialsSignin: 'Sign in failed. Check the details you provided are correct.',
	SessionRequired: 'Please sign in to access this page.',
};
