// https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices

import 'server-only';

import { PrismaClient, Prisma } from '@prisma/client';
import { getErrorMessage } from '@/helpers';

export function errorHandling(error: unknown) {
	if (process.env.NODE_ENV === 'development') console.log(JSON.stringify(error));
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

const prismaClientSingleton = () => {
	return new PrismaClient();
};

declare const globalThis: {
	prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;

export var entrySelect = {
	sentencePlusPhoneticSymbols: true,
	translation: true,
	note: true,
	id: true,
} satisfies Prisma.VocabEntrySelect;

export var userSelect = {
	name: true,
	id: true,
	email: true,
} satisfies Prisma.UserSelect;
