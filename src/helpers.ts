import { Prisma } from '@prisma/client';
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

export function errorHandling(error: unknown) {
	if (process.env.NODE_ENV === 'development') console.log(error);
	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		// The .code property can be accessed in a type-safe manner
		if (error.code === 'P2002') {
			return { errorMessage: 'The very sentence has already been saved. Please update the existing one instead.' };
		} else {
			return { errorMessage: `${error.message}. Code: ${error.code}` };
		}
	} else if (error instanceof Prisma.PrismaClientInitializationError) {
		return { errorMessage: `${error.message}. Code: ${error.errorCode}` };
	} else {
		let errorMessage = getErrorMessage(error);
		return { errorMessage };
	}
}
