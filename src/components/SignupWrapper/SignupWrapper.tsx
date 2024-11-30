'use client';

import Link from 'next/link';
import * as React from 'react';

import SignupForm from '@/components/SignupForm';
import ErrorMsg from '@/components/ErrorMsg';

function SignupWrapper() {
	return (
		<div>
			<SignupForm />
			<div>
				<p>
					Already have an account?&nbsp;
					<Link href='/signin'>Sign In</Link>
				</p>
			</div>
			<ErrorMsg />
		</div>
	);
}

export default SignupWrapper;
