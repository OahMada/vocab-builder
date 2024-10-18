import { ZodError } from 'zod';

export function constructZodErrorMessage(err: ZodError) {
	let errorMessage = '';
	err.issues.forEach((issue) => {
		errorMessage = errorMessage + `${issue.message} at field ${issue.path}.`;
	});
	return errorMessage;
}
