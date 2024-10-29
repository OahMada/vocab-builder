import { getErrorMessage } from '@/helpers';
import { Prisma } from '@prisma/client';

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
