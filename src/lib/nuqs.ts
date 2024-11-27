import { createSearchParamsCache, parseAsString, createParser } from 'nuqs/server';

import { signinErrors } from '@/constants';

export var searchParser = parseAsString.withDefault('').withOptions({ shallow: false, throttleMs: 1000 });

export var searchParamsCache = createSearchParamsCache({
	search: searchParser,
});

var parseAsSignInPageErrorParam = createParser({
	parse(queryValue) {
		if (queryValue in signinErrors) {
			return queryValue as Exclude<keyof typeof signinErrors, 'default'>;
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
