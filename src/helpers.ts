import { ZodError } from 'zod';

export function constructZodErrorMessage(err: ZodError) {
	let errorMessage = '';
	err.issues.forEach((issue) => {
		errorMessage = errorMessage + `${issue.message} at field: ${issue.path}. `;
	});
	return errorMessage;
}

export async function delay(time: number) {
	await new Promise((resolve) => setTimeout(resolve, time));
}

export function getErrorMessage(error: unknown): string {
	let message: string;
	if (error instanceof Error) {
		message = error.message;
	} else if (error && typeof error === 'object' && 'message' in error) {
		message = String(error.message);
	} else if (typeof error === 'string') {
		message = error;
	} else {
		message = 'Something went wrong';
	}
	return message;
}
