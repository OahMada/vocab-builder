import { NextRequest, NextResponse } from 'next/server';

import { UserInputSchema } from '@/lib/dataValidation';
import { delay } from '@/helpers';
import performAxiosRequest from '@/lib/performAxiosRequest';

export async function POST(request: NextRequest) {
	// for mock
	let searchParams = request.nextUrl.searchParams;
	let mock = searchParams.get('mock');
	if (mock === 'true') {
		await delay(2000);
		return new NextResponse('我们在一个夏末坐在一起， 那个美丽温柔的女人，你的密友.', { status: 200 });
		return new NextResponse('Unexpected Error', { status: 400 });
	}

	// production logic
	let { sentence } = await request.json();

	// validation
	let result = UserInputSchema.safeParse(sentence);
	if (result.error) {
		let formattedError = result.error.format();
		return new NextResponse(JSON.stringify(formattedError._errors[0]), { status: 400 });
	}

	return performAxiosRequest(result.data, `You are a language translator. You will translate any text provided by the user into Chinese.`);
}
