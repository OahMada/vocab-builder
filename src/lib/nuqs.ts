import { createSearchParamsCache, parseAsString, createParser } from 'nuqs/server';

import { SIGNINERRORS } from '@/constants';

export var searchParser = parseAsString.withDefault('').withOptions({ shallow: false, throttleMs: 1000 });

export var searchParamsCache = createSearchParamsCache({
	search: searchParser,
});

var parseAsSignInPageErrorParam = createParser({
	parse(queryValue) {
		if (queryValue in SIGNINERRORS) {
			return queryValue as Exclude<keyof typeof SIGNINERRORS, 'default'>;
		} else {
			return 'default';
		}
	},
	serialize(value) {
		return value;
	},
});

export var errorParamsCache = createSearchParamsCache({
	error: parseAsSignInPageErrorParam,
});
