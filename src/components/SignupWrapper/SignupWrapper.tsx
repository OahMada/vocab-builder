'use client';

import Link from 'next/link';
import * as React from 'react';

import { useErrorMessageContext } from '@/components/ErrorMessageProvider';

import SignupForm from '@/components/SignupForm';
import Toast from '@/components/Toast';

function SignupWrapper() {
	let { errorMsg } = useErrorMessageContext();
	return (
		<div>
			<SignupForm />
			<div>
				<p>
					Already have an account?&nbsp;
					<Link href='/signin'>Sign In</Link>
				</p>
			</div>
			{errorMsg && <Toast toastType='error' content={errorMsg} />}
		</div>
	);
}

export default SignupWrapper;
