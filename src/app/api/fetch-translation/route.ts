import { NextRequest } from 'next/server';
import axios, { AxiosError, isAxiosError } from 'axios';

const API_KEY = process.env.OPENAI_API_KEY;
const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

export async function POST(request: NextRequest) {
	let reqBody = await request.json();

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
				{ role: 'user', content: reqBody.sentence },
			],
		},
		headers: { 'content-type': 'application/json', Authorization: `Bearer ${API_KEY}` },
	};

	try {
		let { data, status, statusText } = await axios(AxiosConfig);
		// throw new Error('Error out');
		return new Response(JSON.stringify(data['choices'][0]['message']['content']), { status, statusText });
	} catch (err) {
		let error = err as Error | AxiosError;
		// https://axios-http.com/docs/handling_errors
		if (isAxiosError(error)) {
			if (error.response) {
				return new Response(JSON.stringify(error.response.data), { status: error.response.status, statusText: error.response.statusText });
			} else if (error.request) {
				// The request was made but no response was received
				// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
				// http.ClientRequest in node.js
				return new Response(JSON.stringify(error.request), { status: 500 });
			}
		} else {
			// Something happened in setting up the request that triggered an Error
			return new Response(JSON.stringify(error.message), { status: 500 });
		}
	}
}
