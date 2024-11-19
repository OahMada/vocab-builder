import 'server-only';

import { getErrorMessage } from '@/helpers';
import axios, { isAxiosError } from 'axios';
import { NextResponse } from 'next/server';

const API_KEY = process.env.OPENAI_API_KEY;
const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

export default async function performAxiosRequest(data: string, content: string) {
	let AxiosConfig = {
		method: 'post',
		url: API_ENDPOINT,
		data: {
			model: 'gpt-4o',
			messages: [
				{
					role: 'system',
					content,
				},
				{ role: 'user', content: data },
			],
		},
		headers: { 'content-type': 'application/json', Authorization: `Bearer ${API_KEY}` },
	};

	try {
		let { data, status, statusText } = await axios(AxiosConfig);
		return new NextResponse(JSON.stringify(data['choices'][0]['message']['content']), { status, statusText });
	} catch (error) {
		if (process.env.NODE_ENV === 'development') console.log(error);
		// https://axios-http.com/docs/handling_errors
		if (isAxiosError(error)) {
			if (error.response) {
				return new NextResponse(JSON.stringify(error.response.data ? error.response.data : 'Something went wrong, please try again later'), {
					status: error.response.status,
					statusText: error.response.statusText,
				});
			} else {
				return new NextResponse('Something went wrong, please try again later', { status: 500 });
			}
		} else {
			// Something happened in setting up the request that triggered an Error
			let errorMessage = getErrorMessage(error);
			return new NextResponse(JSON.stringify(errorMessage), { status: 500 });
		}
	}
}
