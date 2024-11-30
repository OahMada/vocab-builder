'use server';

import { AuthError, User } from 'next-auth';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

import { auth, signIn, signOut } from '@/auth';
import prisma, { prismaErrorHandling, userSelect } from '@/lib/db';
import { SigninFormSchemaType, UserSchema, SocialLoginFormSchema } from '@/lib/dataValidation';
import { constructZodErrorMessage, getErrorMessageFromError } from '@/helpers';
import { DatabaseUser } from '@/types';
import { User as PrismaUser } from '@prisma/client';

export async function signup(data: unknown): Promise<{ data: DatabaseUser } | { errorMessage: string }> {
	let result = UserSchema.safeParse(data);

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
		let response = await prisma.$transaction(async (tx) => {
			let user = await tx.user.create({
				data: {
					email,
					name,
					password: hashedPassword,
				},
				select: userSelect,
			});

			await tx.account.create({
				data: {
					userId: user.id,
					type: 'credentials',
					provider: 'credentials',
					providerAccountId: user.id,
				},
			});

			return user;
		});
		return { data: response };
	} catch (error) {
		return prismaErrorHandling(error);
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

export async function updateUser(data: unknown): Promise<{ data: User } | { errorMessage: string }> {
	// authorization
	let session = await auth();
	if (!session?.user) {
		return { errorMessage: 'Not authenticated.' };
	}
	let {
		user: { id: userId },
	} = session;

	// data validation
	let result = UserSchema.partial().safeParse(data);
	if (result.error) {
		return {
			errorMessage: constructZodErrorMessage(result.error),
		};
	}
	let { name, email, password } = result.data;

	// fetch user data
	let user: PrismaUser | null;
	try {
		user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		});
		if (!user) {
			return {
				errorMessage: 'User not found',
			};
		}
	} catch (error) {
		return prismaErrorHandling(error);
	}

	// update call
	if (name) {
		if (name === user.name) {
			return {
				data: session.user,
			};
		}

		try {
			let response = await prisma.user.update({
				where: {
					id: userId,
				},
				data: {
					name,
				},
				select: userSelect,
			});

			revalidatePath('/setting');

			return { data: response };
		} catch (error) {
			return prismaErrorHandling(error);
		}
	}

	if (email) {
		if (email === user.email) {
			return {
				data: session.user,
			};
		}

		try {
			let response = await prisma.user.update({
				where: {
					id: userId,
				},
				data: {
					email,
				},
				select: userSelect,
			});
			revalidatePath('/setting');

			return { data: response };
		} catch (error) {
			return prismaErrorHandling(error);
		}
	}

	if (password && user.password) {
		let isPasswordMatch = await bcrypt.compare(password, user.password);
		if (isPasswordMatch) {
			return {
				data: session.user,
			};
		}
		let hashedNewPassword = await bcrypt.hash(password, 10);

		try {
			let response = await prisma.user.update({
				where: {
					id: userId,
				},
				data: {
					password: hashedNewPassword,
				},
				select: userSelect,
			});
			revalidatePath('/setting');

			return { data: response };
		} catch (error) {
			return prismaErrorHandling(error);
		}
	}

	return {
		errorMessage: 'Something went wrong on the server',
	};
}
