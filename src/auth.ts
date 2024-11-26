// https://github.com/nextauthjs/next-auth/discussions/4394#discussioncomment-5503602

import 'server-only';

import NextAuth, { CredentialsSignin } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';

import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';

import prisma from './lib/db';
import { SigninFormSchema } from './lib/dataValidation';
import { constructZodErrorMessage } from './helpers';

class InvalidLoginError extends CredentialsSignin {
	constructor(code: string) {
		super();
		this.code = code;
		this.message = code;
	}
}

export var { handlers, signIn, signOut, auth } = NextAuth(() => {
	let adapter = PrismaAdapter(prisma);
	return {
		adapter,
		providers: [
			Google,
			GitHub,
			Credentials({
				async authorize(credentials) {
					if (credentials === null) return null;

					let result = SigninFormSchema.safeParse(credentials);
					if (result.error) {
						let errorMessage = constructZodErrorMessage(result.error);
						throw new InvalidLoginError(errorMessage);
					}
					let { email, password } = result.data;

					try {
						let user = await prisma.user.findUnique({
							where: {
								email,
							},
							include: {
								accounts: true,
							},
						});
						if (user) {
							// why index 0? because there would be only one record.
							if (user.accounts[0].provider !== 'credentials') {
								throw new InvalidLoginError(`Please sign in with ${user.accounts[0].provider}`);
							}

							let isMatch = await bcrypt.compare(password, user.password as string);
							if (isMatch) {
								return user;
							} else {
								throw new InvalidLoginError('Email or password is not correct');
							}
						} else {
							throw new InvalidLoginError('User not found');
						}
					} catch (error) {
						if (error instanceof Prisma.PrismaClientInitializationError || error instanceof Prisma.PrismaClientKnownRequestError) {
							throw new InvalidLoginError('System error. Please contact support');
						}
						throw error;
					}
				},
			}),
		],
		callbacks: {
			async jwt({ token, user, account }) {
				if (account?.provider === 'credentials') {
					let expires = new Date(Date.now() + 60 * 60 * 24 * 30 * 1000);
					let sessionToken = randomUUID();

					let session = await adapter.createSession!({
						userId: user.id as string,
						sessionToken,
						expires,
					});
					token.sessionId = session.sessionToken;
				}
				return token;
			},
		},
		jwt: {
			async encode({ token }) {
				return token?.sessionId as string;
			},
			async decode() {
				return null;
			},
		},
		pages: {
			signIn: '/login',
			newUser: '/',
		},
		debug: process.env.NODE_ENV === 'development',
		logger: {
			error(code, ...message) {
				console.error('logger1', code, message);
				console.log('logger1', code.cause);
			},
			warn(code, ...message) {
				console.warn('logger2', code, message);
			},
			debug(code, ...message) {
				console.debug('logger3', code, message);
			},
		},
		events: {
			async signOut(message) {
				if ('session' in message && message.session?.sessionToken) {
					await prisma.session.deleteMany({
						// using delete would cause an error, not sure why. There do might be multiple session records, if user tried to login on different webpages.
						where: {
							sessionToken: message.session?.sessionToken,
						},
					});
				}
			},
		},
	};
});
