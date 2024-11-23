import * as React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';

import LoginForm from '@/components/LoginForm';
import OAuthLogin from '@/components/OAuthLogin';

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
			<OAuthLogin />
		</div>
	);
}
