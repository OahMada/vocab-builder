'use server';

import { AuthError } from 'next-auth';
import bcrypt from 'bcryptjs';

import { signIn, signOut } from '@/auth';
import prisma, { PrismaErrorHandling } from '@/lib/db';
import { SigninFormSchemaType, SignupFormSchema, SocialLoginFormSchema } from '@/lib/dataValidation';
import { constructZodErrorMessage, getErrorMessageFromError } from '@/helpers';

export async function signup(data: unknown): Promise<{ data: string } | { errorMessage: string }> {
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

export type SignupReturnType = ReturnType<typeof signup>;

export async function credentialsLogin(data: SigninFormSchemaType) {
	try {
		await signIn('credentials', { ...data, redirect: false });
	} catch (error) {
		return { errorMessage: getErrorMessageFromError(error) };
	}
}

export type CredentialsSigninReturnType = ReturnType<typeof credentialsLogin>;

export async function socialLogin(data: unknown, callback: string) {
	let result = SocialLoginFormSchema.safeParse(data);
	if (result.error) {
		let errorMessage = constructZodErrorMessage(result.error);
		return {
			errorMessage,
		};
	}

	try {
		await signIn(result.data, {
			redirectTo: callback,
		});
	} catch (error) {
		// Signin can fail for a number of reasons, such as the user
		// not existing, or the user not having the correct role.
		// In some cases, you may want to redirect to a custom error
		if (error instanceof AuthError) {
			return { errorMessage: getErrorMessageFromError(error) };
		}

		// Otherwise if a redirects happens Next.js can handle it
		// so you can just re-thrown the error and let Next.js handle it.
		// Docs:
		// https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
		throw error;
	}
}

export async function signout() {
	try {
		await signOut();
	} catch (error) {
		if (error instanceof AuthError) {
			return { errorMessage: getErrorMessageFromError(error) };
		}
		throw error;
	}
}
