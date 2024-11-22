import Link from 'next/link';
import * as React from 'react';

import SignupForm from '@/components/SignupForm';

export default function SignUpPage() {
	return (
		<div>
			<SignupForm />
			<div>
				<p>
					Already have an account?&nbsp;
					<Link href='/signin'>Sign In</Link>
				</p>
			</div>
		</div>
	);
}
