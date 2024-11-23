'use server';

import { AuthError } from 'next-auth';
import bcrypt from 'bcryptjs';

import { signIn, signOut } from '@/auth';
import prisma, { PrismaErrorHandling } from '@/lib/db';
import { SigninFormSchemaType, SignupFormSchema, SocialLoginFormSchema } from '@/lib/dataValidation';
import { constructZodErrorMessage, getErrorMessageFromError } from '@/helpers';

export async function credentialsLogin(data: SigninFormSchemaType) {
	try {
		await signIn('credentials', { ...data, redirect: false });
	} catch (error) {
		// TODO what the error is like?
		console.log(error);

		// if (error instanceof AuthError) {
		// 	return PrismaErrorHandling(error.cause?.err);
		// } else {
		return { errorMessage: getErrorMessageFromError(error) };
		// }
	}
}

export async function signup(data: unknown) {
	let result = SignupFormSchema.safeParse(data);

	if (result.error) {
		let errorMessage = constructZodErrorMessage(result.error);
		return { errorMessage };
	}

	let { password, name, email } = result.data;

	let user = await prisma.user.findUnique({
		where: {
			email,
		},
	});

	if (user) {
		return {
			errorMessage: 'User already exists with this email.',
		};
	}

	let hashedPassword = await bcrypt.hash(password, 10);

	try {
		await prisma.$transaction(async (tx) => {
			const { id } = await tx.user.create({
				data: {
					email,
					name,
					password: hashedPassword,
				},
			});

			await tx.account.create({
				data: {
					userId: id,
					type: 'credentials',
					provider: 'credentials',
					providerAccountId: id,
				},
			});
		});
		return { data: 'User created.' };
	} catch (error) {
		return PrismaErrorHandling(error);
	}
}

export async function socialLogin(data: FormData) {
	let result = SocialLoginFormSchema.safeParse(data.get('action'));
	if (result.error) {
		let errorMessage = constructZodErrorMessage(result.error);
		return {
			errorMessage,
		};
	}

	await signIn(result.data);
}
