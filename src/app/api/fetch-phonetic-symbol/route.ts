import { NextRequest, NextResponse } from 'next/server';

import { PhoneticSymbolSchema } from '@/lib/dataValidation';
import { delay } from '@/helpers';
import performAxiosRequest from '@/lib/performAxiosRequest';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
	let session = await auth();

	if (!session?.user) {
		return new NextResponse('Not authenticated', { status: 401 });
	}

	// for mock
	let searchParams = request.nextUrl.searchParams;
	let mock = searchParams.get('mock');
	if (mock === 'true') {
		await delay(2000);
		return new NextResponse('/həˈləʊ/', { status: 200 });
		return new Response('Unexpected Error', { status: 400 });
	}

	// // production logic
	let { word } = await request.json();

	// // validation
	let result = PhoneticSymbolSchema.safeParse(word);
	if (result.error) {
		let formattedError = result.error.format();
		return new NextResponse(JSON.stringify(formattedError._errors[0]), { status: 400 });
	}

	return performAxiosRequest(
		result.data,
		'You provide phonetic symbols for the word that is passed to you. There is no need to analyze it; just return the symbol itself; no other description is needed'
	);
}
