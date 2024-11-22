import Link from 'next/link';
import * as React from 'react';

import LoginForm from '@/components/LoginForm';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function SignInPage() {
	let session = await auth();
	if (session?.user) {
		redirect('/');
	}

	return (
		<div>
			<LoginForm />
			<div>
				<p>
					Don&apos;t have an account yet?&nbsp;
					<Link href='/signup'>Sign Up</Link>
				</p>
			</div>
		</div>
	);
}
