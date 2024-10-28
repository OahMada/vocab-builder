import { NextRequest } from 'next/server';

import { PhoneticSymbolSchema } from '@/lib/dataValidation';
import { delay } from '@/helpers';
import performAxiosRequest from '@/lib/performAxiosRequest';

export async function POST(request: NextRequest) {
	// for mock
	let searchParams = request.nextUrl.searchParams;
	let mock = searchParams.get('mock');
	if (mock === 'true') {
		await delay(2000);
		return new Response('Unexpected Error', { status: 400 });
		return new Response('/həˈləʊ/', { status: 200 });
	}

	// // production logic
	let { word } = await request.json();

	// // validation
	let result = PhoneticSymbolSchema.safeParse(word);
	if (result.error) {
		let formattedError = result.error.format();
		return new Response(JSON.stringify(formattedError._errors[0]), { status: 400 });
	}

	return performAxiosRequest(
		result.data,
		'You provide phonetic symbols for the word that is passed to you. There is no need to analyze it; just return the symbol itself; no other description is needed'
	);
}
