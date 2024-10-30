import { getErrorMessage } from '@/helpers';
import { Prisma } from '@prisma/client';

export function errorHandling(error: unknown) {
	if (process.env.NODE_ENV === 'development') console.log(error);
	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		// The .code property can be accessed in a type-safe manner
		if (error.code === 'P2002') {
			throw new Error('The very sentence has already been saved. Please update the existing one instead.');
		} else {
			throw new Error(`${error.message} Code: ${error.code}`);
		}
	} else if (error instanceof Prisma.PrismaClientInitializationError) {
		throw new Error(`${error.message} Code: ${error.errorCode}`);
	} else {
		let message = getErrorMessage(error);
		throw new Error(message);
	}
}
