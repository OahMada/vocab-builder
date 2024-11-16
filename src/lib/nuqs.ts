import { createSearchParamsCache, parseAsString } from 'nuqs/server';

export var searchParser = parseAsString.withDefault('').withOptions({ shallow: false, throttleMs: 1000 });

export var searchParamsCache = createSearchParamsCache({
	search: searchParser,
});
