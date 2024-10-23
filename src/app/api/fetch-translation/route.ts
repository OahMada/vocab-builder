import { NextRequest } from 'next/server';
import axios, { isAxiosError } from 'axios';

import { UserInputSchema } from '@/lib/dataValidation';
import { delay, getErrorMessage } from '@/helpers';

const API_KEY = process.env.OPENAI_API_KEY;
const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

export async function POST(request: NextRequest) {
	// for mock
	let searchParams = request.nextUrl.searchParams;
	let mock = searchParams.get('mock');
	if (mock === 'true') {
		await delay(2000);
		return new Response('我们在一个夏末坐在一起， 那个美丽温柔的女人，你的密友.', { status: 200 });
		return new Response('Unexpected Error', { status: 400 });
	}

	// production logic
	let { sentence } = await request.json();

	// validation
	let result = UserInputSchema.safeParse(sentence);
	if (result.error) {
		let formattedError = result.error.format();
		return new Response(JSON.stringify(formattedError._errors[0]), { status: 400 });
	}

	let AxiosConfig = {
		method: 'post',
		url: API_ENDPOINT,
		data: {
			model: 'gpt-4o',
			messages: [
				{
					role: 'system',
					content: `You are a language translator. You will translate any text provided by the user into Chinese.`,
				},
				{ role: 'user', content: result.data },
			],
		},
		headers: { 'content-type': 'application/json', Authorization: `Bearer ${API_KEY}` },
	};

	try {
		let { data, status, statusText } = await axios(AxiosConfig);
		return new Response(JSON.stringify(data['choices'][0]['message']['content']), { status, statusText });
	} catch (error) {
		if (process.env.NODE_ENV === 'development') console.log(error);
		// https://axios-http.com/docs/handling_errors
		if (isAxiosError(error)) {
			if (error.response) {
				return new Response(JSON.stringify(error.response.data ? error.response.data : 'Something went wrong, please try again later'), {
					status: error.response.status,
					statusText: error.response.statusText,
				});
			} else if (error.request) {
				// The request was made but no response was received
				// `error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in node.js
				return new Response('Something went wrong, please try again later', { status: 500 });
			}
		} else {
			// Something happened in setting up the request that triggered an Error
			let errorMessage = getErrorMessage(error);
			return new Response(JSON.stringify(errorMessage), { status: 500 });
		}
	}
}
