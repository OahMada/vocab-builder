import { createSearchParamsCache, parseAsString } from 'nuqs/server';

export var searchParser = parseAsString.withDefault('').withOptions({ shallow: false });

export var searchParamsCache = createSearchParamsCache({
	search: searchParser,
});
