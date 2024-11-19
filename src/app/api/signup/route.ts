import { NextRequest, NextResponse } from 'next/server';

import { SignupFormSchema } from '@/lib/dataValidation';
import { constructZodErrorMessage } from '@/helpers';
import prisma, { userSelect, errorHandling } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
	let data = await request.json();

	let result = SignupFormSchema.safeParse(data);

	if (result.error) {
		let errorMessage = constructZodErrorMessage(result.error);
		return new NextResponse(errorMessage, {
			status: 400,
		});
	}

	let { password, name, email } = result.data;

	let hashedPassword = await bcrypt.hash(password, 10);

	try {
		await prisma.user.create({ data: { name, email, password: hashedPassword }, select: userSelect });
	} catch (error) {
		let result = errorHandling(error);
		return new NextResponse(result.errorMessage, {
			status: 500,
		});
	}
	return new NextResponse('User created.', {
		status: 201,
	});
}
